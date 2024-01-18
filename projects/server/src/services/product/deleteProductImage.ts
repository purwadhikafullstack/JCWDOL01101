import { DB } from '@/database';
import { Image } from '@/interfaces/image.interface';
import { unlinkAsync } from '../multer.service';
import { HttpException } from '@/exceptions/HttpException';
import fs from 'fs';

export async function deleteProductImage(imageId: number): Promise<Image> {
  const findProductImage = await DB.Image.findByPk(imageId);
  if (!findProductImage) throw new HttpException(409, "Image doesn't exist");

  await DB.Image.destroy({ where: { id: imageId } });
  fs.access(`uploads/${findProductImage.image}`, fs.constants.F_OK, err => {
    if (!err) {
      unlinkAsync(`uploads/${findProductImage.image}`);
    }
  });
  const images: Image[] = await DB.Image.findAll({ where: { productId: findProductImage.productId } });
  if (images && images.length > 0) {
    await DB.Product.update({ primaryImage: images[0].image }, { where: { id: findProductImage.productId } });
  } else {
    await DB.Product.update({ primaryImage: null }, { where: { id: findProductImage.productId } });
  }
  return findProductImage;
}
