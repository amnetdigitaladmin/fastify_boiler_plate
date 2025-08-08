import { userSessions } from '../schemas/user-sessions';
// import { User } from '../schemas/user';
import { User } from '@dineshReddyPadala/shared_models'
import AppDataSource from "../../config/db";  

const userSessionRepository = AppDataSource.getRepository(userSessions);

class UserSessionsRepository {

    public async save(obj: any) {
        try{
            return await userSessionRepository.save(obj)
        }catch(err){
            console.log(err);
            
        }
    }

    public async isSessionActive(user_id: number) {
        try {
            return await userSessionRepository
                .createQueryBuilder('user_sessions')
                .where('user_sessions.user_id=:user_id', { user_id: user_id })
                .andWhere('user_sessions.is_active=:is_active', { is_active: true })
                .andWhere('user_sessions.is_deleted=:is_deleted', { is_deleted: false })
                .getOne();
        } catch (err) {
            console.log(err);
        }
    }

}

export default new UserSessionsRepository()