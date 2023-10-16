import { execute } from "../services/mysql.connector";
import { Verse } from "./bible.model";
import { OkPacket } from "mysql";
import { bibleQueries } from './bible.queries';

// Function to read all books from the database.
export const readBooks = async () => {
    // Executes SQL query to read all books and returns the results.
    return execute<string[]>(bibleQueries.readBooks, []);
};

// Function to read chapters for a specific book from the database.
export const readChaptersByBook = async (book: string) => {
    // Executes SQL query to read chapters for the specified book and returns the results.
    return execute<number[]>(bibleQueries.readChaptersByBook, [book]);
};

// Function to read verses for a specific chapter in a book from the database.
export const readVersesByChapter = async (book: string, chapter: number) => {
    // Executes SQL query to read verses for the specified chapter in the book and returns the results.
    return execute<Verse[]>(bibleQueries.readVersesByChapter, [book, chapter]);
};

// Function to search verses by text in the database.
export const searchVersesByText = async (searchText: string) => {
    // Executes SQL query to search for verses by text and returns the results.
    return execute<Verse[]>(bibleQueries.searchVersesByText, [`%${searchText}%`]);
};

// Function to read all verses from the database.
export const readVerses = async () => {
    // Executes SQL query to read all verses and returns the results.
    return execute<Verse[]>(bibleQueries.readVerses, []);
};

// Function to read a verse by its ID from the database.
export const readVerseById = async (verseId: number): Promise<Verse[]> => {
    // Executes SQL query to read a specific verse by ID and returns the result.
    return execute<Verse[]>(bibleQueries.readVerseById, [verseId]);
};

// Function to create a new verse in the database.
export const createVerse = async (verse: Verse) => {
    try {
        // Executes SQL query to insert a new verse and returns the result of the execution.
        const result = await execute<OkPacket>(bibleQueries.createVerse, [
            verse.book,
            verse.chapter,
            verse.verseNumber,
            verse.text
        ]);
        return result;
    } catch (error) {
        console.error('[bible.dao][createVerse][Error]', error);
        throw error; // Rethrow the error to be handled in the controller.
    }
};

// Function to update an existing verse in the database.
export const updateVerse = async (verse: Verse) => {
    try {
        // Create an array to hold the columns to be updated.
        const updateColumns = [];
        const updateValues = [];

        if (verse.book !== undefined) {
            updateColumns.push('book');
            updateValues.push(verse.book);
        }

        if (verse.chapter !== undefined) {
            updateColumns.push('chapter');
            updateValues.push(verse.chapter);
        }

        if (verse.verseNumber !== undefined) {
            updateColumns.push('verse');
            updateValues.push(verse.verseNumber);
        }

        if (verse.text !== undefined) {
            updateColumns.push('text');
            updateValues.push(verse.text);
        }

        if (updateColumns.length === 0) {
            throw new Error('No valid fields to update');
        }

        // Construct the SQL query dynamically based on the columns to update.
        const updateQuery = `UPDATE bible.t_kjv
                             SET ${updateColumns.map(col => `${col} = ?`).join(', ')}
                             WHERE id = ?`;

        // Add the verse ID to the values array.
        updateValues.push(verse.id);

        // Execute the update query.
        const result = await execute<OkPacket>(updateQuery, updateValues);

        return result;
    } catch (error) {
        console.error('[bible.dao][updateVerse][Error]', error);
        throw error;
    }
};


// Function to delete a verse by a specific verse ID from the database.
export const deleteVerse = async (verseId: number) => {
    // Executes SQL query to delete a specific verse by ID and returns the result of the execution.
    return execute<OkPacket>(bibleQueries.deleteVerse, [verseId]);
};