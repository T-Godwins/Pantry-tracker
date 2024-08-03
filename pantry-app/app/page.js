"use client"
import { Box, Stack, Typography, Button, TextField, Modal } from "@mui/material";
import { firestore } from "../firebase.js";
import { collection, getDocs, getDoc, setDoc, query, doc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import Head from 'next/head';
// import GoogleAnalytics from ".GoogleAnalytics";
import Recipe from "./gemini";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: 400,
  height: "300px",
  bgcolor: 'background.paper',
  borderRadius: "15px",
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 5,
};

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [itemName, setItemName] = useState('');
  const [filterText, setFilterText] = useState('');
  const [open, setOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState('');
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOpen = (item) => {
    setItemToRemove(item);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({ name: doc.id, ...doc.data() });
    });
    setPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const addItem = async (item) => {
    const itemNameLowerCase = item.toLowerCase();
    const docRef = doc(collection(firestore, 'pantry'), itemNameLowerCase);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 });
    } else {
      await setDoc(docRef, { count: 1 });
    }
    await updatePantry();
  };

  const decrementItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count > 1) {
        await setDoc(docRef, { count: count - 1 });
      } else {
        await deleteDoc(docRef);
      }
    }
    await updatePantry();
  };

  const removeAllItems = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    await deleteDoc(docRef);
    await updatePantry();
  };

  const filteredPantry = pantry.filter(({ name }) => 
    name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <>
      {/* <Head>
        <GoogleAnalytics />
      </Head> */}
      <Box
        width="100vw"
        bgcolor="#D3D3D3"
        height="100vh"
        display="flex"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
        gap={2}
      >
        <Box
          width="800px" 
          height="100px"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          paddingBottom={2}
        >
          <Typography variant="h1" color="#333" textAlign="center">
            Smart Pantry
          </Typography>
          <Stack 
            direction="row"
            spacing={2}
            width="200px"
            alignItems="center"
            padding={1}
          >
            <TextField 
              id="filter-basic" 
              label="Filter Items" 
              variant="outlined" 
              fullWidth
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </Stack>
        </Box>

        <Box width="800px">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack 
            direction={'row'} 
            spacing={2} 
            width="100%"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <TextField 
              id="outlined-basic" 
              label="Item" 
              variant="outlined" 
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button 
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName('');
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
{/* 
        <Box width="800px" mt={2}>
          <Typography id="recipe-modal-title" variant="h6" component="h2">
            Suggested Recipe
          </Typography>
          <Recipe pantryItems={pantry.map(item => item.name)} setRecipe={setRecipe} setLoading={setLoading} />
          {loading && <Typography variant="body1" color="#333" textAlign="left" width="100%">Loading...</Typography>}
          <Typography variant="body1" color="#333" textAlign="left" width="100%">
            {recipe}
          </Typography>
        </Box> */}

        <Box sx={{ borderTop: 5 }} width="800px">
          <Stack
            width="100%"
            height="300px"
            spacing={2}
            overflow="auto"
            padding={1}
          >
            {filteredPantry.map(({ name, count }) => (
              <Box
                key={name}
                sx={{ borderRadius: '16px' }}
                width="100%" 
                height="150px"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                border={'1px solid'}
                mb={1}
                paddingX={2}
              >
                <Stack alignItems="left" display="flex" flexDirection="column">
                  <Typography variant="h4" color="#333" textAlign="left">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant="h7" color="#333" textAlign="left">
                    Quantity: {count}
                  </Typography>
                </Stack>
                <Box display="flex" gap={2}>
                  <Button variant="contained" onClick={() => addItem(name)}>
                    +
                  </Button>
                  <Button variant="contained" onClick={() => decrementItem(name)}>
                    -
                  </Button>
                  <Button variant="contained" onClick={() => handleOpen(name)}>
                    Remove
                  </Button>
                </Box>          
              </Box>
            ))}
          </Stack>
        </Box>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Confirm Removal
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Are you sure you want to remove {itemToRemove} from the pantry?
            </Typography>
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  removeAllItems(itemToRemove);
                  handleClose();
                }}
              >
                Remove
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </>
  );
}
