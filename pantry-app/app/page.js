"use client"
import { Box, Stack, Typography, Button, Modal, TextField } from "@mui/material";
import { firestore } from "/Users/tuyishimeg/Desktop/Projects/Pantry-Tracker/firebase.js";
import { collection, getDocs, getDoc, setDoc, query, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 5,
};

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [filterText, setFilterText] = useState('');

  const handleOpen = () => setOpen(true);
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
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack direction={'row'} spacing={2}>
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
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Stack 
        direction="row"
        spacing={2}
        width="800px"
        alignItems="center"
        padding={1}
      >
        <Button variant="contained" onClick={handleOpen}>Add</Button>
        <TextField 
          id="filter-basic" 
          label="Filter Items" 
          variant="outlined" 
          fullWidth
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </Stack>
      <Box border={'1px solid'} width="800px">
        <Box
          width="100%" 
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h1" color="#333" textAlign="center">
            Pantry Items
          </Typography>
        </Box>
        <Stack
          width="100%"
          height="300px"
          spacing={2}
          overflow="auto"
          padding={2}
        >
          {filteredPantry.map(({ name, count }) => (
            <Box
              key={name}
              width="100%" 
              minHeight="150px"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              bgcolor="#f0f0f0"
              mb={2}
              paddingX={5}
            >
              <Typography variant="h3" color="#333" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h3" color="#333" textAlign="center">
                Quantity: {count}
              </Typography>
              <Box display="flex" gap={2}>
                <Button variant="contained" onClick={() => addItem(name)}>
                  +
                </Button>
                <Button variant="contained" onClick={() => decrementItem(name)}>
                  -
                </Button>
                <Button variant="contained" onClick={() => removeAllItems(name)}>
                  Remove
                </Button>
              </Box>          
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
