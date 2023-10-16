// Import necessary modules and types
import { Request, RequestHandler, Response } from 'express';
import { Verse } from './bible.model';
import * as BibleDao from './bible.dao';
const express = require('express');
const app = express();
// JSON parsing middleware
app.use(express.json());

// Handler to retrieve a verse by ID
export const readVerseById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const verseId: number = parseInt(req.params.verseId as string); // Parse verseId from params
        const verse = await BibleDao.readVerseById(verseId); // Retrieve verse by verseId

        if (verse) {
            res.status(200).json(verse); // Respond with the retrieved verse
        } else {
            res.status(404).json({ message: 'Verse not found' }); // Respond with a not found message
        }
    } catch (error) {
        console.error('[bible.controller][readVerseById][Error]', error); // Log error
        res.status(500).json({ message: 'There was an error when fetching the verse' }); // Respond with error message
    }
};

// Handler to retrieve all verses or a verse by ID
export const readVerses: RequestHandler = async (req: Request, res: Response) => {
    try {
        let verses: Verse[] | undefined; // Variable to store verses retrieved from the database
        let verseId: number | undefined = parseInt(req.query.verseId as string); // Parse verseId from query params

        if (Number.isNaN(verseId)) {
            verses = await BibleDao.readVerses(); // Retrieve all verses if no specific verseId provided
        } else {
            verses = await BibleDao.readVerseById(verseId); // Retrieve verse by verseId if provided
        }

        if (verses) {
            res.status(200).json(verses); // Respond with the retrieved verses
        } else {
            res.status(404).json({ message: 'Verse not found' }); // Respond with a not found message
        }
    } catch (error) {
        console.error('[bible.controller][readVerses][Error]', error); // Log error
        res.status(500).json({ message: 'There was an error when fetching verses' }); // Respond with error message
    }
};

// Handler to create a new verse
export const createVerse: RequestHandler = async (req: Request, res: Response) => {
    try {
        const verse: Verse = req.body as Verse; // Get the verse data from the request body
        console.log('Received verse data:', verse); // Add this line for debugging
        const insertedVerse = await BibleDao.createVerse(verse); // Create the verse

        res.status(201).json(insertedVerse); // Respond with the inserted verse and 201 status code for creation
    } catch (error) {
        console.error('[bible.controller][createVerse][Error]', error); // Log error
        res.status(500).json({ message: 'There was an error when creating a verse' }); // Respond with error message
    }
};

export const updateVerse: RequestHandler = async (req: Request, res: Response) => {
    try {
        const verseId: number = parseInt(req.params.verseId as string); // Parse verseId from params
        const existingVerses: Verse[] = await BibleDao.readVerseById(verseId); // Retrieve existing verse(s)

        if (existingVerses.length === 0) {
            return res.status(404).json({ message: 'Verse not found' });
        }

        const updatedVerse: Verse = {
            id: verseId, // Keep the same ID
            book: req.body.book !== undefined ? req.body.book : existingVerses[0].book,
            chapter: req.body.chapter !== undefined ? req.body.chapter : existingVerses[0].chapter,
            verseNumber: req.body.verseNumber !== undefined ? req.body.verseNumber : existingVerses[0].verseNumber,
            text: req.body.text !== undefined ? req.body.text : existingVerses[0].text,
        };

        const result = await BibleDao.updateVerse(updatedVerse); // Update the verse

        if (result.affectedRows > 0) {
            res.status(200).json(updatedVerse); // Respond with the updated verse
        } else {
            res.status(500).json({ message: 'Failed to update the verse' });
        }
    } catch (error) {
        console.error('[bible.controller][updateVerse][Error]', error); // Log error
        res.status(500).json({ message: 'There was an error when updating the verse' });
    }
};

// Handler to delete a verse
export const deleteVerse: RequestHandler = async (req: Request, res: Response) => {
    try {
        let verseId: number | undefined = parseInt(req.params.verseId as string); // Parse verseId from params

        if (!Number.isNaN(verseId)) {
            const response = await BibleDao.deleteVerse(verseId); // Delete verse

            if (response.affectedRows > 0) {
                res.status(204).end(); // Respond with no content for successful deletion
            } else {
                res.status(404).json({ message: 'Verse not found' }); // Respond with a not found message
            }
        } else {
            res.status(400).json({ message: 'Invalid verseId' }); // Respond with a bad request for invalid verseId
        }
    } catch (error) {
        console.error('[bible.controller][deleteVerse][Error]', error); // Log error on verse deletion
        res.status(500).json({ message: 'There was an error when deleting a verse' }); // Respond with error message
    }
};

// Handler to retrieve all books
export const readBooks: RequestHandler = async (req: Request, res: Response) => {
    try {
        // Retrieve all books from the database
        const books = await BibleDao.readBooks();
        res.status(200).json(books); // Respond with the retrieved books
    } catch (error) {
        console.error('[bible.controller][readBooks][Error]', error); // Log error
        res.status(500).json({ message: 'There was an error when fetching books' }); // Respond with error message
    }
};

// Handler to retrieve chapters for a specific book
export const readChaptersByBook: RequestHandler = async (req: Request, res: Response) => {
    try {
        const book = req.params.book; // Get the book name from request params
        // Retrieve chapters for the specified book from the database
        const chapters = await BibleDao.readChaptersByBook(book);
        res.status(200).json(chapters); // Respond with the retrieved chapters
    } catch (error) {
        console.error('[bible.controller][readChaptersByBook][Error]', error); // Log error
        res.status(500).json({ message: 'There was an error when fetching chapters' }); // Respond with error message
    }
};

// Handler to retrieve verses for a specific chapter in a book
export const readVersesByChapter: RequestHandler = async (req: Request, res: Response) => {
    try {
        const book = req.params.book; // Get the book name from request params
        const chapter = parseInt(req.params.chapter); // Get the chapter number from request params

        // Retrieve verses for the specified chapter in the book from the database
        const verses = await BibleDao.readVersesByChapter(book, chapter);
        res.status(200).json(verses); // Respond with the retrieved verses
    } catch (error) {
        console.error('[bible.controller][readVersesByChapter][Error]', error); // Log error
        res.status(500).json({ message: 'There was an error when fetching verses' }); // Respond with error message
    }
};

// Handler to search verses by text
export const searchVersesByText: RequestHandler = async (req: Request, res: Response) => {
    try {
        const searchText = req.params.searchText;
        // Search for verses by text in the database
        const verses = await BibleDao.searchVersesByText(searchText);
        res.status(200).json(verses); // Respond with the retrieved verses
    } catch (error) {
        console.error('[bible.controller][searchVersesByText][Error]', error); // Log error
        res.status(500).json({ message: 'There was an error when searching for verses' }); // Respond with error message
    }
};