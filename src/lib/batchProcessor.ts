// Batch Processing Service for NPI Agent Verifier
// Simulates NPI validation and data enrichment using local processing

import { localStorageService, Provider, Batch } from './localStorage';

export interface ProcessingResult {
  success: boolean;
  processedCount: number;
  errorCount: number;
  errors: string[];
}

export interface NPIValidationResult {
  isValid: boolean;
  confidence: number;
  enrichedData?: {
    name?: string;
    specialty?: string;
    address?: string;
    phone?: string;
    email?: string;
    licenseNumber?: string;
    licenseExpiry?: string;
  };
  sources: string[];
}

class BatchProcessor {
  // Simulate NPI validation and enrichment
  private async validateNPI(npi: string): Promise<NPIValidationResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));
    
    // Simulate validation logic
    const isValidNPI = /^\d{10}$/.test(npi);
    const confidence = Math.random() * 30 + 70; // 70-100% confidence
    
    if (!isValidNPI) {
      return {
        isValid: false,
        confidence: 0,
        sources: ['NPI Registry'],
      };
    }

    // Simulate enriched data based on NPI
    const enrichedData = {
      name: `Dr. ${this.generateRandomName()}`,
      specialty: this.getRandomSpecialty(),
      address: this.generateRandomAddress(),
      phone: this.generateRandomPhone(),
      email: this.generateRandomEmail(),
      licenseNumber: `MD${Math.floor(Math.random() * 99999)}-WA`,
      licenseExpiry: this.generateRandomExpiryDate(),
    };

    return {
      isValid: true,
      confidence,
      enrichedData,
      sources: ['NPI Registry', 'State Medical Board', 'Practice Website'],
    };
  }

  // Process a single provider
  private async processProvider(rawData: any, batchId: string): Promise<Provider> {
    const npi = rawData.npi || rawData.NPI || rawData['NPI Number'] || '';
    const validation = await this.validateNPI(npi);
    
    const provider: Provider = {
      id: `${batchId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      npi,
      name: validation.enrichedData?.name || rawData.name || rawData.Name || 'Unknown',
      specialty: validation.enrichedData?.specialty || rawData.specialty || rawData.Specialty || 'General Practice',
      status: validation.isValid ? (validation.confidence >= 90 ? 'verified' : 'needs_review') : 'needs_review',
      confidence: validation.confidence,
      lastValidated: new Date().toISOString(),
      batchId,
      rawData,
    };

    return provider;
  }

  // Process CSV data
  private parseCSVData(csvText: string): any[] {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        data.push(row);
      }
    }

    return data;
  }

  // Main batch processing function
  async processBatch(
    file: File,
    batchName: string,
    onProgress?: (progress: number, processed: number, total: number) => void
  ): Promise<ProcessingResult> {
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fileType = file.name.endsWith('.csv') ? 'csv' : 'pdf';
    
    // Create batch record
    const batch: Batch = {
      id: batchId,
      name: batchName,
      status: 'processing',
      totalProviders: 0,
      processedProviders: 0,
      createdAt: new Date().toISOString(),
      fileType,
      fileName: file.name,
    };

    localStorageService.addBatch(batch);

    try {
      let rawData: any[] = [];
      
      if (fileType === 'csv') {
        const csvText = await this.readFileAsText(file);
        rawData = this.parseCSVData(csvText);
      } else {
        // For PDF files, simulate OCR processing
        rawData = await this.simulatePDFProcessing(file);
      }

      batch.totalProviders = rawData.length;
      localStorageService.updateBatch(batchId, { totalProviders: rawData.length });

      const providers: Provider[] = [];
      const errors: string[] = [];
      let processedCount = 0;
      let errorCount = 0;

      // Process each provider
      for (let i = 0; i < rawData.length; i++) {
        try {
          const provider = await this.processProvider(rawData[i], batchId);
          providers.push(provider);
          processedCount++;
        } catch (error) {
          errorCount++;
          errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        // Update progress
        const progress = Math.round(((i + 1) / rawData.length) * 100);
        onProgress?.(progress, i + 1, rawData.length);
        
        // Update batch progress
        localStorageService.updateBatch(batchId, { 
          processedProviders: i + 1 
        });

        // Add providers to storage
        if (providers.length > 0) {
          const existingProviders = localStorageService.getProviders();
          localStorageService.saveProviders([...existingProviders, ...providers]);
          providers.length = 0; // Clear array for next batch
        }
      }

      // Mark batch as completed
      localStorageService.updateBatch(batchId, {
        status: 'completed',
        completedAt: new Date().toISOString(),
      });

      return {
        success: true,
        processedCount,
        errorCount,
        errors,
      };

    } catch (error) {
      localStorageService.updateBatch(batchId, {
        status: 'failed',
      });

      return {
        success: false,
        processedCount: 0,
        errorCount: 1,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  // Utility methods
  private async readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }

  private async simulatePDFProcessing(file: File): Promise<any[]> {
    // Simulate PDF OCR processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return mock data for demonstration
    return [
      { npi: '1234567890', name: 'Dr. John Smith', specialty: 'Cardiology' },
      { npi: '0987654321', name: 'Dr. Jane Doe', specialty: 'Pediatrics' },
      { npi: '1122334455', name: 'Dr. Bob Johnson', specialty: 'Orthopedics' },
    ];
  }

  private generateRandomName(): string {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Emily', 'James', 'Jessica'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson', 'Martinez'];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  }

  private getRandomSpecialty(): string {
    const specialties = [
      'Cardiology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'Internal Medicine',
      'Family Medicine', 'Emergency Medicine', 'Radiology', 'Anesthesiology', 'Psychiatry'
    ];
    return specialties[Math.floor(Math.random() * specialties.length)];
  }

  private generateRandomAddress(): string {
    const streets = ['Main St', 'Oak Ave', 'Pine Rd', 'Elm St', 'Maple Dr'];
    const cities = ['Seattle', 'Portland', 'Vancouver', 'Tacoma', 'Spokane'];
    const streetNumber = Math.floor(Math.random() * 9999) + 1;
    const street = streets[Math.floor(Math.random() * streets.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const zip = Math.floor(Math.random() * 90000) + 10000;
    return `${streetNumber} ${street}, ${city}, WA ${zip}`;
  }

  private generateRandomPhone(): string {
    const areaCode = Math.floor(Math.random() * 900) + 100;
    const exchange = Math.floor(Math.random() * 900) + 100;
    const number = Math.floor(Math.random() * 9000) + 1000;
    return `(${areaCode}) ${exchange}-${number}`;
  }

  private generateRandomEmail(): string {
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'clinic.com', 'medical.com'];
    const name = this.generateRandomName().toLowerCase().replace(' ', '.');
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${name}@${domain}`;
  }

  private generateRandomExpiryDate(): string {
    const year = new Date().getFullYear() + Math.floor(Math.random() * 5) + 1;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
  }
}

export const batchProcessor = new BatchProcessor();
