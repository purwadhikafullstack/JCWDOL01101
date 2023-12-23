import { DB } from '@/database';
import { ProductDto } from '@/dtos/product.dto';
import { unlinkAsync } from '../multer.service';
import { Status, Product, Image, Inventory } from '@/interfaces';
import { HttpException } from '@/exceptions/HttpException';
import { Op } from 'sequelize';
import fs from 'fs';

export async function updateProduct(
  slug: string,
  currentImage: { imageId: number; file: Express.Multer.File }[],
  files: Express.Multer.File[],
  productData: ProductDto,
) {
  const findProduct: Product = await DB.Product.findOne({ where: { slug } });
  if (!findProduct) throw new HttpException(409, "Product doesn't already exist");

  if (files.length > 0) {
    for (let i = 0; i < currentImage.length; i++) {
      const imageId = currentImage[i].imageId;
      if (imageId) {
        const image: Image = await DB.Image.findByPk(Number(imageId));
        await DB.Image.update({ image: files[i].filename }, { where: { id: Number(imageId) } });
        fs.access(`uploads/${image.image}`, fs.constants.F_OK, err => {
          if (!err) {
            unlinkAsync(`uploads/${image.image}`);
          }
        });
      } else {
        await DB.Image.create({ image: files[i].filename, productId: findProduct.id });
      }
    }
  }

  const { size } = productData;
  const findAllInventory = await DB.Inventories.findAll({ where: { productId: findProduct.id } });
  const findAllWarehouse = await DB.Warehouses.findAll();

  if (findAllInventory && findAllInventory.length > 0) {
    const inventoryUpdates = findAllInventory.map(async inventory => {
      const existingInventory = size.includes(inventory.sizeId);
      if (!existingInventory) {
        await DB.Inventories.update({ status: 'DEACTIVATED' }, { where: { id: inventory.id, sizeId: inventory.sizeId } });
      }
    });
    await Promise.all(inventoryUpdates);
  }

  if (findAllWarehouse && findAllWarehouse.length > 0) {
    const warehouses = findAllWarehouse.map(warehouse => ({ warehouseId: warehouse.id, productId: findProduct.id }));

    const inventoryData = [];
    for (const s of size) {
      const existingInventory = findAllInventory.find(inventory => inventory.sizeId === +s);
      if (existingInventory) {
        if (existingInventory.status === 'DEACTIVATED') {
          await DB.Inventories.update({ status: 'ACTIVE' }, { where: { sizeId: existingInventory.sizeId } });
        }
      } else {
        inventoryData.push(...warehouses.map(warehouse => ({ ...warehouse, sizeId: +s })));
      }
    }
    if (inventoryData.length > 0) {
      await DB.Inventories.bulkCreate(inventoryData);
    }
  }

  const newSlug = productData.name
    .toLocaleLowerCase()
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, '-');
  const images: Image[] = await DB.Image.findAll({ where: { productId: findProduct.id } });
  if (!images || images.length === 0) throw new HttpException(409, 'No image');
  await DB.Product.update({ ...productData, slug: newSlug, primaryImage: images[0].image }, { where: { slug } });
  const updatedProduct: Product = await DB.Product.findOne({ where: { slug: newSlug } });
  return updatedProduct;
}

export async function updateProductStatus(
  productId: number,
  warehouseId: number | undefined,
  status: Status,
  previousStatus: Status,
): Promise<Product> {
  const findProduct: Product = await DB.Product.findByPk(productId);
  if (!findProduct) throw new HttpException(409, "Product doesn't exist");

  await DB.CartProduct.update({ status }, { where: { productId } });
  await DB.Product.update({ status }, { where: { id: productId } });
  if (warehouseId && status == 'ACTIVE') {
    await DB.Inventories.update(
      { status: status },
      {
        where: {
          productId,
          warehouseId,
          status: previousStatus,
        },
      },
    );
  } else {
    await DB.Inventories.update({ status: status }, { where: { productId } });
  }

  return findProduct;
}

export async function updateProductInventoryStatus(productId: number, warehouseId: number, status: Status): Promise<Inventory> {
  const findProduct: Product = await DB.Product.findByPk(productId);
  if (!findProduct) throw new HttpException(409, "Product doesn't exist");
  const findInventory: Inventory = await DB.Inventories.findOne({ where: { status: 'ACTIVE', productId, warehouseId } });
  if (!findInventory) throw new HttpException(409, "Inventory doesn't exist");

  await DB.CartProduct.update({ status }, { where: { productId } });
  await DB.Inventories.update(
    { status },
    {
      where: {
        productId,
        warehouseId,
        status: {
          [Op.not]: 'DEACTIVATED',
        },
      },
    },
  );

  return findInventory;
}
