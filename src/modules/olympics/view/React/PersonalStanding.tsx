import { OlympicsPresenter } from '@/modules/olympics/presenter/OlympicsPresenter.ts';
import { FC } from 'react';
import { Card, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { DisplayTypeEnum, TeamView } from '@/modules/olympics/view/React/TeamView.tsx';

interface PersonalStandingProps {
  presenter: OlympicsPresenter;
}

export const PersonalStanding: FC<PersonalStandingProps> = ({ presenter }) => {
  return (
    <Card className="p-5 pb-4 flex-wrap gap-2 w-full max-h-[100%] overflow-hidden">
      <Table
        isHeaderSticky
        aria-label={'Personal standing'}
        className={'overflow-hidden'}
        classNames={{
          base: 'max-h-[95%] overflow-y-scroll',
          table: 'min-h-[420px]',
        }}>
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Nationality</TableColumn>
          <TableColumn>Team</TableColumn>
          <TableColumn>Points</TableColumn>
        </TableHeader>
        <TableBody>
          {presenter.olympicsModel.candidats.map((candidat, index) => (
            <TableRow key={index}>
              <TableCell className={candidat.candidat.isPlayer ? 'font-bold' : ''}>{candidat.candidat.name}</TableCell>
              <TableCell>{candidat.candidat.nationality.getCode()}</TableCell>
              <TableCell>{candidat.points}</TableCell>
              <TableCell>
                <TeamView team={candidat.team} displayType={DisplayTypeEnum.SPAN} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
