export const createRandomId = (
   length: number = 32,
   useUppercaseLetters: boolean = true,
   useLowercaseLetters: boolean = true,
   useNumbers: boolean = true,
): string => {
   let characters: string[] = [];
   let letters: string[] = [];
   const uppercaseLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
   const lowercaseletters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
   const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
   if (useUppercaseLetters) {
      letters = letters.concat(uppercaseLetters);
      characters = characters.concat(uppercaseLetters);
   }
   if (useLowercaseLetters) {
      letters = letters.concat(lowercaseletters);
      characters = characters.concat(lowercaseletters);
   }
   if (useNumbers) characters = characters.concat(numbers);
   if (characters.length === 0) {
      letters = letters.concat(uppercaseLetters);
      letters = letters.concat(lowercaseletters);
      characters = characters.concat(letters);
      characters = characters.concat(numbers);
   }
   let id = '';
   for (let i = 0; i < length; i++) {
      if (i === 0 && letters.length > 0) {
         const randomNumber = Math.floor(Math.random() * letters.length);
         id += letters[randomNumber];
      } else {
         const randomNumber = Math.floor(Math.random() * characters.length);
         id += characters[randomNumber];
      }
   }
   return id;
}