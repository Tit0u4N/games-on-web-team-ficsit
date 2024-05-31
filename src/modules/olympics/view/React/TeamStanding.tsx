import { OlympicsPresenter } from '@/modules/olympics/presenter/OlympicsPresenter.ts';
import { FC } from 'react';
import { Card, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { DisplayTypeEnum, TeamView } from '@/modules/olympics/view/React/TeamView.tsx';

interface TeamStandingProps {
  presenter: OlympicsPresenter;
}

export const TeamStanding: FC<TeamStandingProps> = ({ presenter }) => {
  return (
    <Card className="p-5 pb-4 flex-wrap gap-2 w-full max-h-[100%] overflow-hidden">
      <Table
        isStriped
        isHeaderSticky
        aria-label={'Team standing'}
        className={'overflow-hidden'}
        classNames={{
          base: 'max-h-[95%] overflow-y-scroll',
          table: 'min-h-[420px]',
        }}>
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Team mates</TableColumn>
          <TableColumn>Points</TableColumn>
        </TableHeader>
        <TableBody>
          {presenter.olympicsModel.teams
            .sort((a, b) => b.points - a.points)
            .map((team, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TeamView team={team} displayType={DisplayTypeEnum.SPAN} />
                </TableCell>
                <TableCell>
                  <div>
                    {team.candidats.map((character, index) => (
                      <div className={character.isPlayer ? 'font-bold' : ''} key={index}>
                        {character.name}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{team.points}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Card>
  );
};
