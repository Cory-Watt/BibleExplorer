// Define an interface for a Bible verse.
export interface Verse {
    id: number;
    book: string;          // Name of the book
    chapter: number;       // Chapter number
    verseNumber: number;   // Verse number
    text: string;          // Text of the verse
}