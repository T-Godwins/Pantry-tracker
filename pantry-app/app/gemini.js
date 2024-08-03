// // gemini.js
// import React, { useState } from "react";
// import OpenAI from "openai";

// const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

// const Recipe = ({ pantryItems, setRecipe, setLoading }) => {

//   const aiRun = async () => {
//     setLoading(true);
//     setRecipe('');
//     const prompt = `Suggest a recipe using the following ingredients: ${pantryItems.join(', ')}`;

//     try {
//       const completion = await openai.chat.completions.create({
//         messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: prompt }],
//         model: "gpt-4o-mini",
//       });

//       const text = completion.choices[0].message.content;
//       setRecipe(text);
//     } catch (error) {
//       console.error("Error generating recipe:", error);
//       setRecipe("Failed to generate recipe.");
//     }

//     setLoading(false);
//   };

//   return (
//     <div style={{ display: 'flex' }}>
//       <button style={{ marginLeft: '20px' }} onClick={aiRun} disabled={loading}>
//         Suggest Recipe
//       </button>
//     </div>
//   );
// };

// export default Recipe;
