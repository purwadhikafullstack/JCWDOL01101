import { DB } from '@/database';
import { ProductDto } from '@/dtos/product.dto';
import { HttpException } from '@/exceptions/HttpException';
import { Product, Image } from '@/interfaces';

export async function createProduct(files: Express.Multer.File[], productData: ProductDto): Promise<Product> {
  const { name, size } = productData;

  const slug = name
    .toLocaleLowerCase()
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, '-');
  const created = await DB.Product.findOne({ where: { slug } });
  if (created) throw new HttpException(409, `Product with slug ${slug} already exist`);

  const product = await DB.Product.create({ ...productData, slug });
  const imageData = files.map(file => ({ image: file.filename, productId: product.id }));
  const images: Image[] = await DB.Image.bulkCreate(imageData);

  const primaryImage = images[0]?.image;
  if (primaryImage) {
    await DB.Product.update({ primaryImage }, { where: { id: product.id } });
  }

  const findAllWarehouse = await DB.Warehouses.findAll();

  if (findAllWarehouse && findAllWarehouse.length > 0) {
    const warehouses = findAllWarehouse.map(warehouse => ({ warehouseId: warehouse.id, productId: product.id }));

    const inventoryData = [];
    for (const s of size) {
      const sizeWarehouses = warehouses.map(warehouse => ({ ...warehouse, sizeId: +s }));
      inventoryData.push(...sizeWarehouses);
    }
    await DB.Inventories.bulkCreate(inventoryData);
  }

  return product;
}
