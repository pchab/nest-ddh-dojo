import { Dragon } from '../../../domain/dragon.entity';
import { DragonNotFoundError } from '../../../domain/dragon.error';
import { DragonMockAdapter } from '../../../../infrastructure/mock/dragon.mock-adapter';
import { IsDragonDeadQueryHandler } from './is-dragon-dead.query-handler';
import { IsDragonDeadQuery } from './is-dragon-dead.query';

describe('is dragon dead query', () => {
  const dragonMockAdapter = new DragonMockAdapter();
  const isDragonDeadQueryHandler = new IsDragonDeadQueryHandler(
    dragonMockAdapter,
  );

  it('should return false for a dragon with more than 0 hp', async () => {
    const dragon = await dragonMockAdapter.create({});

    const { isDead } = await isDragonDeadQueryHandler.execute(
      new IsDragonDeadQuery({ dragonId: dragon.id }),
    );
    expect(isDead).toStrictEqual(false);
    dragonMockAdapter.delete(dragon.id);
  });

  it('should return true for a dragon with less than 0 hp', async () => {
    const dragon = await dragonMockAdapter.create({ currentHp: -1 });

    const { isDead } = await isDragonDeadQueryHandler.execute(
      new IsDragonDeadQuery({ dragonId: dragon.id }),
    );
    expect(isDead).toStrictEqual(true);
    dragonMockAdapter.delete(dragon.id);
  });

  it('should throw if the dragon does not exist', async () => {
    const missingDragonId = 'dragon-id-not-existing' as Dragon['id'];

    await expect(
      isDragonDeadQueryHandler.execute(
        new IsDragonDeadQuery({ dragonId: missingDragonId }),
      ),
    ).rejects.toThrow(new DragonNotFoundError(missingDragonId));
  });
});
