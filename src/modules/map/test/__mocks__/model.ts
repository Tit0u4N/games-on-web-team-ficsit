import { TileKey } from '../../model/GraphTilesModel.ts';

export const mockTileModel = jest.fn().mockImplementation((id: TileKey) => {
  return {
    getID: jest.fn().mockReturnValue(id),
  };
});
