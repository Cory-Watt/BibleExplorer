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
        // Parse verseId from params
        const verseId: number = parseInt(req.params.verseId as string);
        // Retrieve verse by verseId
        const verse = await BibleDao.readVerseById(verseId);

        if (verse) {
            // Respond with the retrieved verse
            res.status(200).json(verse);
        } else {
            // Respond with a not found message
            res.status(404).json({ message: 'Verse not found' });
        }
    } catch (error) {
        console.error('[bible.controller][readVerseById][Error]', error);
        // Respond with error message
        res.status(500).json({ message: 'There was an error when fetching the verse' });
    }
};

// Handler to retrieve all verses or a verse by ID
export const readVerses: RequestHandler = async (req: Request, res: Response) => {
    try {
        // Variable to store verses retrieved from the database
        let verses: Verse[] | undefined;
        // Parse verseId from query params
        let verseId: number | undefined = parseInt(req.query.verseId as string);

        if (Number.isNaN(verseId)) {
            // Retrieve all verses if no specific verseId provided
            verses = await BibleDao.readVerses();
        } else {
            // Retrieve verse by verseId if provided
            verses = await BibleDao.readVerseById(verseId);
        }

        if (verses) {
            // Respond with the retrieved verses
            res.status(200).json(verses);
        } else {
            // Respond with a not found message
            res.status(404).json({ message: 'Verse not found' });
        }
    } catch (error) {
        console.error('[bible.controller][readVerses][Error]', error);
        // Respond with error message
        res.status(500).json({ message: 'There was an error when fetching verses' });
    }
};

// Handler to create a new verse
export const createVerse: RequestHandler = async (req: Request, res: Response) => {
    try {
        // Get the verse data from the request body
        const verse: Verse = req.body as Verse;
        console.log('Received verse data:', verse); // Add this line for debugging
        // Create the verse
        const insertedVerse = await BibleDao.createVerse(verse);

        // Respond with the inserted verse and 201 status code for creation
        res.status(201).json(insertedVerse);
    } catch (error) {
        console.error('[bible.controller][createVerse][Error]', error);
        // Respond with error message
        res.status(500).json({ message: 'There was an error when creating a verse' });
    }
};

export const updateVerse: RequestHandler = async (req: Request, res: Response) => {
    try {
        // Parse verseId from params
        const verseId: number = parseInt(req.params.verseId as string);
        // Retrieve existing verse(s)
        const existingVerses: Verse[] = await BibleDao.readVerseById(verseId);

        if (existingVerses.length === 0) {
            // Respond with not found message if verse not found
            return res.status(404).json({ message: 'Verse not found' });
        }

        // Create an updatedVerse object
        const updatedVerse: Verse = {
            id: verseId, // Keep the same ID
            book: req.body.book !== undefined ? req.body.book : existingVerses[0].book,
            chapter: req.body.chapter !== undefined ? req.body.chapter : existingVerses[0].chapter,
            verseNumber: req.body.verseNumber !== undefined ? req.body.verseNumber : existingVerses[0].verseNumber,
            text: req.body.text !== undefined ? req.body.text : existingVerses[0].text,
        };

        // Update the verse
        const result = await BibleDao.updateVerse(updatedVerse);

        if (result.affectedRows > 0) {
            // Respond with the updated verse
            res.status(200).json(updatedVerse);
        } else {
            // Respond with an error message if the update fails
            res.status(500).json({ message: 'Failed to update the verse' });
        }
    } catch (error) {
        console.error('[bible.controller][updateVerse][Error]', error);
        // Respond with error message
        res.status(500).json({ message: 'There was an error when updating the verse' });
    }
};

// Handler to delete a verse
export const deleteVerse: RequestHandler = async (req: Request, res: Response) => {
    try {
        // Parse verseId from params
        let verseId: number | undefined = parseInt(req.params.verseId as string);

        if (!Number.isNaN(verseId)) {
            // Delete verse
            const response = await BibleDao.deleteVerse(verseId);

            if (response.affectedRows > 0) {
                // Respond with no content for successful deletion
                res.status(204).end();
            } else {
                // Respond with a not found message if verse not found
                res.status(404).json({ message: 'Verse not found' });
            }
        } else {
            // Respond with a bad request for invalid verseId
            res.status(400).json({ message: 'Invalid verseId' });
        }
    } catch (error) {
        console.error('[bible.controller][deleteVerse][Error]', error);
        // Respond with error message
        res.status(500).json({ message: 'There was an error when deleting a verse' });
    }
};

// Handler to retrieve all books
export const readBooks: RequestHandler = async (req: Request, res: Response) => {
    try {
        // Retrieve all books from the database
        const books = await BibleDao.readBooks();
        // Respond with the retrieved books
        res.status(200).json(books);
    } catch (error) {
        console.error('[bible.controller][readBooks][Error]', error);
        // Respond with error message
        res.status(500).json({ message: 'There was an error when fetching books' });
    }
};

// Handler to retrieve chapters for a specific book
export const readChaptersByBook: RequestHandler = async (req: Request, res: Response) => {
    try {
        // Get the book name from request params
        const book = req.params.book;
        // Retrieve chapters for the specified book from the database
        const chapters = await BibleDao.readChaptersByBook(book);
        // Respond with the retrieved chapters
        res.status(200).json(chapters);
    } catch (error) {
        console.error('[bible.controller][readChaptersByBook][Error]', error);
        // Respond with error message
        res.status(500).json({ message: 'There was an error when fetching chapters' });
    }
};

// Handler to retrieve verses for a specific chapter in a book
export const readVersesByChapter: RequestHandler = async (req: Request, res: Response) => {
    try {
        // Get the book name from request params
        const book = req.params.book;
        // Get the chapter number from request params
        const chapter = parseInt(req.params.chapter);
        // Retrieve verses for the specified chapter in the book from the database
        const verses = await BibleDao.readVersesByChapter(book, chapter);
        // Respond with the retrieved verses
        res.status(200).json(verses);
    } catch (error) {
        console.error('[bible.controller][readVersesByChapter][Error]', error);
        // Respond with error message
        res.status(500).json({ message: 'There was an error when fetching verses' });
    }
};

// Handler to search verses by text
export const searchVersesByText: RequestHandler = async (req: Request, res: Response) => {
    try {
        // Get the search text from request params
        const searchText = req.params.searchText;
        // Search for verses by text in the database
        const verses = await BibleDao.searchVersesByText(searchText);
        // Respond with the retrieved verses
        res.status(200).json(verses);
    } catch (error) {
        console.error('[bible.controller][searchVersesByText][Error]', error);
        // Respond with error message
        res.status(500).json({ message: 'There was an error when searching for verses' });
    }
};