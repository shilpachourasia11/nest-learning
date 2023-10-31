import { Injectable } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Cat } from './schemas/cat.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { redisClient } from '../../common/redis/redis';
@Injectable()
export class CatsService {
  constructor(@InjectModel(Cat.name) private catModel: Model<Cat>) {}

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    const createdCat = new this.catModel(createCatDto);
    return createdCat.save();
  }

  async findAll(): Promise<Cat[]> {
    const checkCacheValue = await redisClient.get('cats');
    if (checkCacheValue) {
      return JSON.parse(checkCacheValue);
    } else {
      const data = await this.catModel.find();
      redisClient
        .set('cats', JSON.stringify(data))
        .then((res) => {
          console.log('res', res);
        })
        .catch((err) => {
          console.log('err', err);
        });
      return data;
    }
  }

  // code before mongo was added
  // create(createCatDto: CreateCatDto) {
  //   this.cats.push(createCatDto);
  //   return `Added new cat #${this.cats}`;
  // }

  // findAll(): Cat[] {
  //   return this.cats;
  // }

  findAllBreeds() {
    return `This action returns all cat breeds available`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cat`;
  }

  update(id: number, updateCatDto: UpdateCatDto) {
    return `This action updates a #${id} cat`;
  }

  remove(id: number) {
    return `This action removes a #${id} cat`;
  }
}
