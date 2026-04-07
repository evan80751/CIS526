/**
 * @file Metadata seed
 * @author Evan Jelle
 * @exports up the Up migration
 * @exports down the Down migration
 */
import csvToJson from "convert-csv-to-json";

const now = new Date().toISOString().slice(0, 23).replace("T", " ") + " +00:00";

export async function up({ context: queryInterface }) {
  const metadata = csvToJson
    .fieldDelimiter(",")
    .getJsonFromCsv("./data/metadata.csv");
  const data = metadata.map((row) => ({
    id: parseInt(row.id),
    title: row.title,
    author: row.author,
    publisher: row.publisher,
    date: row.date,
    abstract: row.abstract,
    citation: row.citation,
    copyright_id: parseInt(row.copyright_id),
    keywords: row.keywords,
    owner_user_id: parseInt(row.owner_user_id),
    createdAt: now,
    updatedAt: now,
  }));
  await queryInterface.bulkInsert("metadata", data);
}

export async function down({ context: queryInterface }) {
  await queryInterface.bulkDelete("metadata", {}, { truncate: true });
}
