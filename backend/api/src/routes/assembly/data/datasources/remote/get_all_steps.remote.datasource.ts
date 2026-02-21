// get_all_steps.remote.datasource.ts
import { db_client } from "@/core/database/db.config";
import {
  BadRequestError,
  InternalServerError,
} from "@/core/errors/custom.error";
import type { AssemblyStepEntity } from "../../../domain/entities/assembly_step.entity";

const GET_ALL_STEPS_QUERY = `
SELECT * FROM assembly_steps
ORDER BY step_order ASC
`;

export const GetAllStepsRemoteDataSource = async (): Promise<AssemblyStepEntity[]> => {
  try {
    const result = await db_client.query(GET_ALL_STEPS_QUERY);
    return result.rows;
  } catch (error) {
    console.log(error);
    if (error instanceof BadRequestError) {
      throw new BadRequestError(error.message);
    }
    throw new InternalServerError("An error occurred");
  }
};
