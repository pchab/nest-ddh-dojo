import { Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Dragon as DragonSchema } from '../../../graphql';
import { Hero } from '../../../heroes/infrastructure/heroes/hero.orm-entity';
import { GenerateRandomDragonCommand } from '../../core/application/commands/generate-random-dragon/generate-random-dragon.command';
import { SlayDragonCommand } from '../../core/application/commands/slay-dragon/slay-dragon.command';
import {
  GetAllDragonsQuery,
  GetAllDragonsQueryResult,
} from '../../core/application/queries/get-all-dragons/get-all-dragons.query';
import { Dragon } from '../../infrastructure/dragons/dragon.orm-entity';
import { mapDragonEntityToDragonSchema } from './dragon.gql-mapper';

@Resolver('dragon')
export class DragonResolver {
  private readonly logger = new Logger(DragonResolver.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Query()
  public async getAllDragons(): Promise<DragonSchema[]> {
    const { dragons } = await this.queryBus.execute<
      GetAllDragonsQuery,
      GetAllDragonsQueryResult
    >(new GetAllDragonsQuery());
    return dragons.map((dragon) => mapDragonEntityToDragonSchema(dragon));
  }

  @Mutation()
  public async generateRandomDragon(): Promise<boolean> {
    await this.commandBus.execute(new GenerateRandomDragonCommand());
    return true;
  }

  @Mutation()
  public async slayDragon(
    @Args('dragonId') dragonId: Dragon['id'],
    @Args('heroId') heroId: Hero['id'],
  ): Promise<boolean> {
    await this.commandBus.execute(new SlayDragonCommand({ dragonId, heroId }));
    return true;
  }
}