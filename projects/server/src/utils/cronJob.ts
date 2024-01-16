import { CronJob } from 'cron';
import { Op } from 'sequelize';
import { DB } from '@/database';

const changeStatusIn7Days = async (from: string, to: string) => {
  const sevenDaysAgo = new Date(new Date().getDate() - 7);
  const isDelivery = await DB.Order.findAndCountAll({
    where: {
      status: from,
      createdAt: {
        [Op.lt]: sevenDaysAgo,
      },
    },
  });
  if (isDelivery.count > 0) {
    await DB.Order.update(
      { status: to },
      {
        where: {
          status: from,
          createdAt: {
            [Op.lt]: sevenDaysAgo,
          },
        },
      },
    );
  }
};

const changeStatusIn1Hour = async (from: string, to: string) => {
  const oneHourAgo = new Date();
  oneHourAgo.setHours(oneHourAgo.getHours() - 1);
  const isDelivery = await DB.Order.findAndCountAll({
    where: {
      status: from,
      createdAt: {
        [Op.lt]: oneHourAgo,
      },
    },
  });
  if (isDelivery.count > 0) {
    await DB.Order.update(
      { status: to },
      {
        where: {
          status: from,
          createdAt: {
            [Op.lt]: oneHourAgo,
          },
        },
      },
    );
  }
};

const updateDaily = new CronJob('0 0 * * *', async () => {
  await changeStatusIn7Days('DELIVERED', 'SUCCESS');
  console.log('hari');
});

const updateHourly = new CronJob('0 * * * *', async () => {
  await changeStatusIn1Hour('PENDING', 'CANCELED');
  console.log('jam');
});

export const startCronjob = () => {
  updateDaily.start();
  updateHourly.start();
};
