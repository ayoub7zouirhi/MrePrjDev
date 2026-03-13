import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLeadChecklistResponseInput } from './dto/create-lead-checklist-response.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LeadChecklistResponsesService {
  constructor(private prisma: PrismaService) {}
  async toggleCheckListResponses(
    input: CreateLeadChecklistResponseInput,
    envId: number,
  ) {
    const leadExists =
      await this.prisma.lead.findFirst({
        where: {
          id: input.leadId,
          environmentId: envId,
        },
        include: { step: true },
      });

    if (!leadExists) {
      throw new NotFoundException(
        'Lead not Found',
      );
    }
    const validateChecklistItem =
      await this.prisma.checklistItem.findFirst({
        where: {
          id: input.checklistItemId,
          stepId: leadExists.step.id,
        },
      });
    if (!validateChecklistItem) {
      throw new BadRequestException(
        'Invalid Checklist Item for this Lead',
      );
    }
    return this.prisma.leadChecklistResponse.upsert(
      {
        where: {
          leadId_checklistItemId: {
            leadId: input.leadId,
            checklistItemId:
              input.checklistItemId,
          },
        },
        update: {
          isChecked: input.isChecked,
        },
        create: {
          ...input,
        },
      },
    );
  }

  async findByLead(
    leadId: number,
    envId: number,
  ) {
    const leadExists =
      await this.prisma.lead.findFirst({
        where: {
          id: leadId,
          environmentId: envId,
        },
      });
    if (!leadExists)
      throw new NotFoundException(
        'Lead introuvable',
      );
    return this.prisma.leadChecklistResponse.findMany(
      {
        where: {
          leadId,
        },
      },
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} leadChecklistResponse`;
  }

  remove(id: number) {
    return `This action removes a #${id} leadChecklistResponse`;
  }
}
