/**
 * @file Metadata documents junction seed
 * @author Evan Jelle
 * @exports up the Up migration
 * @exports down the Down migration
 */
import csvToJson from 'convert-csv-to-json';

export async function up({ context: queryInterface }) {
    const MetadataDocuments = csvToJson.fieldDelimiter(',').getJsonFromCsv('./data/metadata_documents.csv');
    const data = MetadataDocuments.map((row) => ({
        metadata_id: parseInt(row.metadata_id),
        document_id: parseInt(row.document_id),
    }));
    await queryInterface.bulkInsert('metadata_documents', data);
}

export async function down({ context: queryInterface }) {
    await queryInterface.bulkDelete('metadata_documents', {}, { truncate: true });
}