import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DragonPorts } from '../../core/application/ports/dragon.ports';
import { Dragon } from '../../core/domain/dragon.entity';
import { Dragon as DragonOrmEntity } from './dragon.orm-entity';
import { mapDragonOrmEntityToDragonEntity } from './dragon.orm-mapper';

@Injectable()
export class DragonAdapter implements DragonPorts {
  constructor(
    @InjectRepository(DragonOrmEntity)
    private dragonsRepository: Repository<DragonOrmEntity>,
  ) {}

  async getDragonById(dragonId: Dragon['id']): Promise<Dragon> {
    const dragon = await this.dragonsRepository.findOne(dragonId);
    return mapDragonOrmEntityToDragonEntity(dragon);
  }

  async getAllDragons(): Promise<Dragon[]> {
    const dragons = await this.dragonsRepository.find();
    return dragons.map(mapDragonOrmEntityToDragonEntity);
  }

  async createDragon(dragonProperties: Partial<Dragon>): Promise<Dragon> {
    const dragon = await this.dragonsRepository.save(dragonProperties);
    return mapDragonOrmEntityToDragonEntity(dragon);
  }

  async updateDragon(
    dragonId: Dragon['id'],
    dragonProperties: Partial<Dragon>,
  ): Promise<Dragon> {
    await this.dragonsRepository.update(dragonId, dragonProperties);
    const dragon = await this.dragonsRepository.findOne(dragonId);
    return mapDragonOrmEntityToDragonEntity(dragon);
  }

  async deleteDragon(dragonId: Dragon['id']): Promise<void> {
    await this.dragonsRepository.delete(dragonId);
  }
}
