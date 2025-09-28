export interface PageSize {
  width: number;
  height: number;
}

export interface BoundingBox {
  topLeft: [number, number];
  bottomRight: [number, number];
}

export class CoordinateScaler {
  private scaleX: number;
  private scaleY: number;
  private originalPageSize: PageSize;
  private currentPageSize: PageSize;

  constructor(originalPageSize: PageSize, currentPageSize: PageSize) {
    this.originalPageSize = originalPageSize;
    this.currentPageSize = currentPageSize;
    this.scaleX = currentPageSize.width / originalPageSize.width;
    this.scaleY = currentPageSize.height / originalPageSize.height;
    
    // Validate scaling factors for unreasonable values
    if (this.scaleX <= 0 || this.scaleY <= 0 || !isFinite(this.scaleX) || !isFinite(this.scaleY)) {
      console.error('[CoordinateScaler] Invalid scaling factors detected, using fallback');
      this.scaleX = 1;
      this.scaleY = 1;
    }
    
    // Log scaling factors for debugging
    console.log('[CoordinateScaler] Scaling factors:', {
      scaleX: this.scaleX,
      scaleY: this.scaleY,
      originalSize: originalPageSize,
      currentSize: currentPageSize
    });
  }

  scaleCoordinates(boundingBox: number[][]): BoundingBox {
    const [[x0, y0], [x1, y1]] = boundingBox;
    
    const scaledBox: BoundingBox = {
      topLeft: [x0 * this.scaleX, y0 * this.scaleY],
      bottomRight: [x1 * this.scaleX, y1 * this.scaleY]
    };
    
    return scaledBox;
  }

  scalePoint(x: number, y: number): [number, number] {
    return [x * this.scaleX, y * this.scaleY];
  }

  getScaleFactors(): { scaleX: number; scaleY: number } {
    return { scaleX: this.scaleX, scaleY: this.scaleY };
  }

  // Enhanced scaling with production environment compensation
  scaleCoordinatesRobust(boundingBox: number[][], environmentCompensation = true): BoundingBox {
    const [[x0, y0], [x1, y1]] = boundingBox;
    
    let adjustedScaleX = this.scaleX;
    let adjustedScaleY = this.scaleY;
    
    if (environmentCompensation) {
      // Apply additional compensation for production builds
      // This accounts for differences in rendering between dev and production
      const isProduction = !__DEV__;
      
      if (isProduction) {
        // Empirical adjustment factors (may need fine-tuning)
        const productionCompensation = {
          x: 0.998, // Slight adjustment for production rendering differences
          y: 0.998
        };
        adjustedScaleX *= productionCompensation.x;
        adjustedScaleY *= productionCompensation.y;
        
        console.log('[CoordinateScaler] Applied production compensation:', productionCompensation);
      }
    }
    
    const scaledBox: BoundingBox = {
      topLeft: [x0 * adjustedScaleX, y0 * adjustedScaleY],
      bottomRight: [x1 * adjustedScaleX, y1 * adjustedScaleY]
    };
    
    return scaledBox;
  }

  // Convert absolute coordinates to percentages (Solution 2 as backup)
  static convertToPercentages(boundingBox: number[][], pageSize: PageSize): number[][] {
    const [[x0, y0], [x1, y1]] = boundingBox;
    return [
      [(x0 / pageSize.width) * 100, (y0 / pageSize.height) * 100],
      [(x1 / pageSize.width) * 100, (y1 / pageSize.height) * 100]
    ];
  }

  // Apply percentage coordinates to any size (Solution 2 as backup)
  static applyPercentageCoordinates(percentBox: number[][], currentSize: PageSize): BoundingBox {
    const [[x0Pct, y0Pct], [x1Pct, y1Pct]] = percentBox;
    return {
      topLeft: [(x0Pct * currentSize.width) / 100, (y0Pct * currentSize.height) / 100],
      bottomRight: [(x1Pct * currentSize.width) / 100, (y1Pct * currentSize.height) / 100]
    };
  }
}
