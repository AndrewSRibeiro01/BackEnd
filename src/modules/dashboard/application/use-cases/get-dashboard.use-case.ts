import { Inject, Injectable } from '@nestjs/common';

import {
  CROP_REPOSITORY,
  CropRepository,
} from '../../../crops/domain/repositories/crop.repository';
import {
  FARM_REPOSITORY,
  FarmRepository,
} from '../../../farms/domain/repositories/farm.repository';
import {
  DashboardResponseDto,
  LandUseSliceDto,
  PieSliceDto,
} from '../dtos/dashboard-response.dto';

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function toPieSlices(
  counts: Map<string, number>,
  total: number,
): PieSliceDto[] {
  return Array.from(counts.entries())
    .map(([label, value]) => ({
      label,
      value,
      percentage: total > 0 ? round2((value / total) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value);
}

@Injectable()
export class GetDashboardUseCase {
  constructor(
    @Inject(FARM_REPOSITORY)
    private readonly farmRepo: FarmRepository,
    @Inject(CROP_REPOSITORY)
    private readonly cropRepo: CropRepository,
  ) {}

  async execute(): Promise<DashboardResponseDto> {
    const [farms, crops] = await Promise.all([
      this.farmRepo.findAll(),
      this.cropRepo.findAll(),
    ]);

    const totalFarms = farms.length;
    let totalHectares = 0;
    let arableSum = 0;
    let vegetationSum = 0;
    const stateCounts = new Map<string, number>();

    for (const farm of farms) {
      totalHectares += farm.areas.totalHa;
      arableSum += farm.areas.arableHa;
      vegetationSum += farm.areas.vegetationHa;
      stateCounts.set(farm.state, (stateCounts.get(farm.state) ?? 0) + 1);
    }

    const cropCounts = new Map<string, number>();
    for (const crop of crops) {
      cropCounts.set(crop.name, (cropCounts.get(crop.name) ?? 0) + 1);
    }

    const landUseTotal = arableSum + vegetationSum;
    const landUse: LandUseSliceDto[] = [
      {
        label: 'arable',
        hectares: round2(arableSum),
        percentage:
          landUseTotal > 0 ? round2((arableSum / landUseTotal) * 100) : 0,
      },
      {
        label: 'vegetation',
        hectares: round2(vegetationSum),
        percentage:
          landUseTotal > 0 ? round2((vegetationSum / landUseTotal) * 100) : 0,
      },
    ];

    return {
      totalFarms,
      totalHectares: round2(totalHectares),
      farmsByState: toPieSlices(stateCounts, totalFarms),
      cropsByName: toPieSlices(cropCounts, crops.length),
      landUse,
    };
  }
}
