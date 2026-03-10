import { IsInt, IsOptional } from 'class-validator';
import { CreateLeadInput } from './create-lead.input';
import {
  InputType,
  Field,
  PartialType,
  Int,
} from '@nestjs/graphql';

@InputType()
export class UpdateLeadInput extends PartialType(
  CreateLeadInput,
) {
  
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  agentId?: number;
}
