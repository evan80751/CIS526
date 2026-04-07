/**
 * @file Counties seed
 * @author Evan Jelle
 * @exports up the Up migration
 * @exports down the Down migration
 */
import csvToJson from "convert-csv-to-json";

const now = new Date().toISOString().slice(0, 23).replace("T", " ") + " +00:00";

export async function up({ context: queryInterface }) {
  const counties = csvToJson
    .fieldDelimiter(",")
    .supportQuotedField(true)
    .getJsonFromCsv("./data/counties.csv");
  const data = counties.map((row) => ({
    id: parseInt(row.id),
    name: row.name,
    code: row.code,
    seat: row.seat,
    population: parseInt(row.population.replace(/,/g, "")),
    est_year: parseInt(row.est_year),
    createdAt: now,
    updatedAt: now,
  }));
  await queryInterface.bulkInsert("counties", data);
}

export async function down({ context: queryInterface }) {
  await queryInterface.bulkDelete("counties", {}, { truncate: true });
}
