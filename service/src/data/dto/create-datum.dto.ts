import { DataFact } from '../../entities/DataFact.entity';

export type CreateDatumDto = Omit<DataFact, 'uuid'>;
