import { NoticesRepository, Notice, CreateNoticeInput } from './notices-repository';

const repository = new NoticesRepository();

export class NoticesService {
  async getAllNotices(): Promise<Notice[]> {
    return repository.findAll();
  }

  async createNotice(input: CreateNoticeInput): Promise<Notice> {
    return repository.create(input);
  }
}