import { Injectable, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FighterPorts } from '../../../combat/core/domain/fight/fighter.ports';
import { Damage } from '../../../combat/core/domain/attack/damage.object-value';
import {
  Fighter,
  HeroFighter,
} from '../../../combat/core/domain/fight/fighter.entity';
import {
  HurtHeroCommand,
  HurtHeroCommandResult,
} from '../../core/application/commands/hurt-hero/hurt-hero.command';
import {
  GetHeroAttackQuery,
  GetHeroAttackQueryResult,
} from '../../core/application/queries/get-hero-attack/get-hero-attack.query';
import {
  IsHeroDeadQuery,
  IsHeroDeadQueryResult,
} from '../../core/application/queries/is-hero-dead/is-hero-dead.query';
import { Hero } from '../../core/domain/hero.entity';

@Injectable()
export class HeroFighterPresenter
  implements FighterPorts<HeroFighter, Fighter>
{
  private readonly logger = new Logger(HeroFighterPresenter.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  public async getAttackStrength(
    heroId: Hero['id'],
  ): Promise<GetHeroAttackQueryResult> {
    const result = await this.queryBus.execute<
      GetHeroAttackQuery,
      GetHeroAttackQueryResult
    >(new GetHeroAttackQuery({ heroId }));
    return result;
  }

  public async receiveDamage(
    heroId: Hero['id'],
    damage: Damage<Fighter>,
  ): Promise<HurtHeroCommandResult> {
    const result = await this.commandBus.execute<
      HurtHeroCommand,
      HurtHeroCommandResult
    >(new HurtHeroCommand({ heroId, damage }));
    return result;
  }

  public async isDead(heroId: Hero['id']): Promise<IsHeroDeadQueryResult> {
    const result = await this.queryBus.execute<
      IsHeroDeadQuery,
      IsHeroDeadQueryResult
    >(new IsHeroDeadQuery({ heroId }));
    return result;
  }
}
