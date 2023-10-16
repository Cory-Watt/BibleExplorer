export const bibleQueries = {
    // Query to retrieve all books with specified columns from the bible.t_kjv table.
    readBooks:
        `SELECT DISTINCT book as bookName 
         FROM bible.t_kjv`,

    // Query to retrieve all chapters for a specific book from the bible.t_kjv table.
    readChaptersByBook:
        `SELECT DISTINCT chapter as chapterNumber 
         FROM bible.t_kjv
         WHERE book = ?`,

    // Query to retrieve all verses for a specific chapter in a book from the bible.t_kjv table.
    readVersesByChapter:
        `SELECT id as id, verse as verseNumber, text 
         FROM bible.t_kjv
         WHERE book = ? AND chapter = ?`,

    // Query to search for verses by text using a LIKE clause in the bible.t_kjv table.
    searchVersesByText:
        `SELECT id as id, book, chapter, verse as verseNumber, text 
         FROM bible.t_kjv
         WHERE text LIKE ?`,

    // Query to retrieve all verses from the bible.t_kjv table.
    readVerses:
        `SELECT id as id, book, chapter, verse as verseNumber, text 
     FROM bible.t_kjv`,

    // Query to retrieve a verse by its ID from the bible.t_kjv table.
    readVerseById:
        `SELECT id as id, book, chapter, verse as verseNumber, text 
         FROM bible.t_kjv
         WHERE id = ?`,

    // Query to insert a new verse into the bible.t_kjv table.
    createVerse:
        `INSERT INTO bible.t_kjv(book, chapter, verse, text) 
     VALUES(?,?,?,?)`,

    // Query to update an existing verse in the bible.t_kjv table by its ID.
    updateVerse:
        `UPDATE bible.t_kjv 
         SET book=?, chapter=?, verse=?, text=? 
         WHERE id = ?`,

    // Query to delete a verse from the bible.t_kjv table by its ID.
    deleteVerse:
        `DELETE FROM bible.t_kjv 
         WHERE id = ?`,
}