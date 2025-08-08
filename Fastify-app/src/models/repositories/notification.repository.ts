import AppDataSource from "../../config/db";
import { Notifications } from '../schemas/notifications';
import { LessThan } from 'typeorm';
const notificationRepository = AppDataSource.getRepository(Notifications);
import _ from 'lodash';
import dateFormat from 'dateformat';

class NotificationsRepository {
 public async get(req:any) {
  let params = req.query;
  return _.isUndefined(params.limit) // to skip pagination
    ? await notificationRepository
        .createQueryBuilder()
        .where({ emp_id: params.empId})
        .orderBy('created_at', 'DESC')
        .getManyAndCount()
    : await notificationRepository // pagination query
        .createQueryBuilder()
        .where({ emp_id: params.empId})
        .skip(params.offset - 1)
        .take(params.limit)
        .orderBy('created_at', 'DESC')
        .getManyAndCount();
};
public async update(params:any) {
  var data: any;
  if (!params.isReadAll) {
    data = await notificationRepository.findOne({
      where: { id: params.id }
    });
    data.is_read = true;
  }

  return params.isReadAll
    ? await notificationRepository //update all
        .createQueryBuilder()
        .update()
        .set({ is_read: true })
        .where({
          emp_id: params.empId,
          is_read: false,
          created_at: this.LessThanDate(new Date()),        
        }) //update all the historical messages
        .returning(['id'])
        .execute()
    : await notificationRepository //update based on id
        .save(data)
        .then((res:any) => {
          return {
            raw: [{ id: res.id }],
          };
        });
};
public async save(params:any) {
  return await notificationRepository.save(params);
};
public async remove(params:any) {
  return params.isDeleteAll
    ? await notificationRepository // delete all
        .createQueryBuilder()
        .delete()
        .from(Notifications)
        .where({ emp_id: params.empId, created_at: this.LessThanDate(new Date()) }) // delete all historical messages
        .execute()
    : await notificationRepository.delete({ id: params.id }); // delete based on id
};

public LessThanDate = (date: Date) => LessThan(dateFormat(date, 'isoDateTime'));
}

export default new NotificationsRepository()