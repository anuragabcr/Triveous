const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getProductsByCategory(req, res) {
  try {
    const { categoryId } = req.query;

    const products = await prisma.product.findMany({
      where: {
        categoryId: parseInt(categoryId),
      },
      select: {
        id: true,
        title: true,
        price: true,
        description: true,
        availability: true,
      },
    });

    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching products" });
  }
}

async function getProductById(req, res) {
  try {
    const { productId } = req.params;

    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(productId),
      },
      select: {
        id: true,
        title: true,
        price: true,
        description: true,
        availability: true,
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching product" });
  }
}

module.exports = {
  getProductsByCategory,
  getProductById,
};
