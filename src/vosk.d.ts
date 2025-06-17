export declare class Model {
  constructor(path: string);
  public delete(): void;
}

export declare class Recognizer {
  constructor(model: Model, sampleRate: number);
  constructor(model: Model, sampleRate: number, grammar: string);
  public SetWords(words: boolean): void;
  public SetPartialWords(partialWords: boolean): void;
  public AcceptWaveform(address: number, length: number): boolean;
  public Result(): string;
  public PartialResult(): string;
  public FinalResult(): string;
  public delete(): void;
}
export declare interface Vosk {
  FS: {
    mkdir: (dirName: string) => void;
    mount: (fs: any, opts: any, path: string) => void;
  };
  MEMFS: Record<string, any>;
  IDBFS: Record<string, any>;
  WORKERFS: Record<string, any>;
  HEAPF32: any;
  downloadAndExtract: (url: string, localPath: string) => Promise<any>;
  syncFilesystem: (fromPersistent: boolean) => Promise<any>;
  Model;
  Recognizer;
  SetLogLevel(level: number): void;
  GetLogLevel(): number;
  _f_init: () => void;
  _malloc: (size: number) => number;
  _free: (buffer: number) => void;
}

export default function LoadVosk(args: any): Promise<Vosk>;
