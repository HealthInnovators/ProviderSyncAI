// Local Storage Service for NPI Agent Verifier
// Handles data persistence without external dependencies

export interface Provider {
  id: string;
  npi: string;
  name: string;
  specialty: string;
  status: "verified" | "processing" | "needs_review";
  confidence: number;
  lastValidated: string;
  batchId?: string;
  rawData?: any;
}

export interface Batch {
  id: string;
  name: string;
  status: "uploading" | "processing" | "completed" | "failed";
  totalProviders: number;
  processedProviders: number;
  createdAt: string;
  completedAt?: string;
  fileType: "csv" | "pdf";
  fileName: string;
}

export interface BatchStats {
  totalBatches: number;
  totalProviders: number;
  verifiedProviders: number;
  processingProviders: number;
  needsReviewProviders: number;
}

class LocalStorageService {
  private readonly PROVIDERS_KEY = 'npi_verifier_providers';
  private readonly BATCHES_KEY = 'npi_verifier_batches';
  private readonly STATS_KEY = 'npi_verifier_stats';

  // Provider Management
  getProviders(): Provider[] {
    try {
      const data = localStorage.getItem(this.PROVIDERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading providers from localStorage:', error);
      return [];
    }
  }

  saveProviders(providers: Provider[]): void {
    try {
      localStorage.setItem(this.PROVIDERS_KEY, JSON.stringify(providers));
      this.updateStats();
    } catch (error) {
      console.error('Error saving providers to localStorage:', error);
    }
  }

  addProvider(provider: Provider): void {
    const providers = this.getProviders();
    providers.push(provider);
    this.saveProviders(providers);
  }

  updateProvider(id: string, updates: Partial<Provider>): void {
    const providers = this.getProviders();
    const index = providers.findIndex(p => p.id === id);
    if (index !== -1) {
      providers[index] = { ...providers[index], ...updates };
      this.saveProviders(providers);
    }
  }

  deleteProvider(id: string): void {
    const providers = this.getProviders();
    const filtered = providers.filter(p => p.id !== id);
    this.saveProviders(filtered);
  }

  // Batch Management
  getBatches(): Batch[] {
    try {
      const data = localStorage.getItem(this.BATCHES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading batches from localStorage:', error);
      return [];
    }
  }

  saveBatches(batches: Batch[]): void {
    try {
      localStorage.setItem(this.BATCHES_KEY, JSON.stringify(batches));
    } catch (error) {
      console.error('Error saving batches to localStorage:', error);
    }
  }

  addBatch(batch: Batch): void {
    const batches = this.getBatches();
    batches.push(batch);
    this.saveBatches(batches);
  }

  updateBatch(id: string, updates: Partial<Batch>): void {
    const batches = this.getBatches();
    const index = batches.findIndex(b => b.id === id);
    if (index !== -1) {
      batches[index] = { ...batches[index], ...updates };
      this.saveBatches(batches);
    }
  }

  // Statistics
  getStats(): BatchStats {
    try {
      const data = localStorage.getItem(this.STATS_KEY);
      return data ? JSON.parse(data) : this.calculateStats();
    } catch (error) {
      console.error('Error loading stats from localStorage:', error);
      return this.calculateStats();
    }
  }

  private calculateStats(): BatchStats {
    const providers = this.getProviders();
    const batches = this.getBatches();
    
    return {
      totalBatches: batches.length,
      totalProviders: providers.length,
      verifiedProviders: providers.filter(p => p.status === 'verified').length,
      processingProviders: providers.filter(p => p.status === 'processing').length,
      needsReviewProviders: providers.filter(p => p.status === 'needs_review').length,
    };
  }

  private updateStats(): void {
    const stats = this.calculateStats();
    try {
      localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
    } catch (error) {
      console.error('Error updating stats in localStorage:', error);
    }
  }

  // Utility Methods
  clearAllData(): void {
    localStorage.removeItem(this.PROVIDERS_KEY);
    localStorage.removeItem(this.BATCHES_KEY);
    localStorage.removeItem(this.STATS_KEY);
  }

  exportData(): { providers: Provider[]; batches: Batch[]; stats: BatchStats } {
    return {
      providers: this.getProviders(),
      batches: this.getBatches(),
      stats: this.getStats(),
    };
  }

  importData(data: { providers: Provider[]; batches: Batch[] }): void {
    this.saveProviders(data.providers);
    this.saveBatches(data.batches);
  }
}

export const localStorageService = new LocalStorageService();
