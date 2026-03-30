/**
 * @file Documents seed
 * @author Evan Jelle
 * @exports up the Up migration
 * @exports down the Down migration
 */
import csvToJson from 'convert-csv-to-json';

const now = new Date().toISOString().slice(0, 23).replace("T", " ") + " +00:00";

export async function up({ context: queryInterface }) {
    const documents = csvToJson.fieldDelimiter(',').getJsonFromCsv('./data/documents.csv');
    const data = documents.map((row) => ({
        id: parseInt(row.id),
        display_name: row.display_name,
        filename: row.filename,
        size: parseInt(row.size),
        type: row.type,
        createdAt: now,
        updatedAt: now,
    }));
    await queryInterface.bulkInsert('documents', data);
}
export async function down({ context: queryInterface }) {
    await queryInterface.bulkDelete('documents', {}, { truncate: true });
}
