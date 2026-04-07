/**
 * @file Metadata communities junction seed
 * @author Evan Jelle
 * @exports up the Up migration
 * @exports down the Down migration
 */
import csvToJson from "convert-csv-to-json";

export async function up({ context: queryInterface }) {
  const metadataCommunities = csvToJson
    .fieldDelimiter(",")
    .getJsonFromCsv("./data/metadata_communities.csv");
  const data = metadataCommunities.map((row) => ({
    metadata_id: parseInt(row.metadata_id),
    community_id: parseInt(row.community_id),
  }));
  await queryInterface.bulkInsert("metadata_communities", data);
}
export async function down({ context: queryInterface }) {
  await queryInterface.bulkDelete(
    "metadata_communities",
    {},
    { truncate: true },
  );
}
