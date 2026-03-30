/**
 * @file Communities seed
 * @author Evan Jelle
 * @exports up the Up migration
 * @exports down the Down migration
 */
import csvToJson from 'convert-csv-to-json';

const now = new Date().toISOString().slice(0, 23).replace("T", " ") + " +00:00";

export async function up({ context: queryInterface }) {
    const communities = csvToJson.fieldDelimiter(',').getJsonFromCsv('./data/communities.csv');
    const data = communities.map((row) => ({
        id: parseInt(row.id),
        name: row.name,
        lat: parseFloat(row.lat),
        long: parseFloat(row.long),
        county_id: parseInt(row.county_id),
        owner_user_id: parseInt(row.owner_user_id),
        createdAt: now,
        updatedAt: now,
    }));
    await queryInterface.bulkInsert('communities', data);
}

export async function down({ context: queryInterface }) {
    await queryInterface.bulkDelete('communities', {}, { truncate: true });
}