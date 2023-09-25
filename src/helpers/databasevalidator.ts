import { Practice } from "../app/app.associatios";

const existPracticeById = async (id = "") => {
  const result = await Practice.findByPk(id);

  if (!result) {
    throw new Error(`Id ${id} does not exist in the database`);
  }
};

export {
    existPracticeById
}