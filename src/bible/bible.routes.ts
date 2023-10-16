import { Router } from 'express';
import * as BibleController from './bible.controller'; // Import the controller module

// Initialize the router
const router = Router();

// route to get all books
router.get('/books', BibleController.readBooks);

// route to get chapters for a specific book
router.get('/books/:book/chapters', BibleController.readChaptersByBook);

// route to get verses for a specific chapter in a book
router.get('/books/:book/chapters/:chapter/verses', BibleController.readVersesByChapter);

// route to search verses by text
router.get('/search/:searchText', BibleController.searchVersesByText);

// route to get a verse by its ID
router.get('/verses/:verseId', BibleController.readVerseById);

// route to create a new verse
router.post('/verses', BibleController.createVerse);

// route to update an existing verse by its ID
router.put('/verses/:verseId', BibleController.updateVerse);

// route to delete a verse by its ID
router.delete('/verses/:verseId', BibleController.deleteVerse);

// Export the configured router
export default router;