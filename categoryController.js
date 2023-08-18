const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getCategories(req, res) {
  try {
    const categories = await prisma.category.findMany();

    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching categories" });
  }
}

module.exports = {
  getCategories,
};
