import { ModalBody, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { TournamentPresenter } from '../../presenter/TournamentPresenter.ts';
import React from 'react';

interface Props {
  tournament: TournamentPresenter;
}

export const TournamentEndView: React.FC<Props> = ({ tournament }) => {
  const getBestBracket = (rank: number) => {
    if (rank < 8) return 'Final';
    else if (rank < 12) return '1/2 Final';
    else if (rank < 16) return '1/4 Final';
    else if (rank < 22) return '1/8 Final';
    else return '1/16 Final';
  };

  return (
    <ModalBody className={'max-h-[80%]'}>
      <div className={'gap-3 h-full m-1 max-h-[100%] relative p-5 overflow-y-scroll'}>
        <Table
          removeWrapper
          isHeaderSticky
          aria-label="Final ranking"
          classNames={{
            base: 'max-h-[100%]',
            table: 'min-h-[400px]',
          }}>
          <TableHeader>
            <TableColumn>RANK</TableColumn>
            <TableColumn>NAME</TableColumn>
            <TableColumn>BEST BRACKET</TableColumn>
          </TableHeader>
          <TableBody>
            {tournament.tournamentModel.finalRankings.map((character, index) => (
              <TableRow
                key={index}
                className={character.character.isPlayer ? 'bg-primary' : index % 2 == 1 ? 'bg-gray-100' : ''}>
                <TableCell>{character.rank + 1}</TableCell>
                <TableCell>{character.character.name}</TableCell>
                <TableCell>{getBestBracket(character.rank)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ModalBody>
  );
};
