import { Router } from 'express';
import * as BibleController from './bible.controller'; // Import the controller module

// Initialize the router
const router = Router();

// Define route to get all books
router.get('/books', BibleController.readBooks); // Use the correct function from the controller

// Define route to get chapters for a specific book
router.get('/books/:book/chapters', BibleController.readChaptersByBook); // Use the correct function from the controller

// Define route to get verses for a specific chapter in a book
router.get('/books/:book/chapters/:chapter/verses', BibleController.readVersesByChapter); // Use the correct function from the controller

// Define route to search verses by text
router.get('/search/:searchText', BibleController.searchVersesByText); // Updated route definition
// Define route to get a verse by its ID
router.get('/verses/:verseId', BibleController.readVerseById); // Use the correct function from the controller

// Define route to create a new verse
router.post('/verses', BibleController.createVerse); // Use the correct function from the controller

// Define route to update an existing verse by its ID
router.put('/verses/:verseId', BibleController.updateVerse); // Use the correct function from the controller

// Define route to delete a verse by its ID
router.delete('/verses/:verseId', BibleController.deleteVerse); // Use the correct function from the controller

// Export the configured router
export default router;