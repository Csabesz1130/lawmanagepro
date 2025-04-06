import { Configuration, OpenAIApi } from 'openai';
import { prisma } from '~/server/prisma';

interface TranscriptionResult {
  text: string;
  confidence: number;
  speakerSegments?: Array<{
    speaker: string;
    text: string;
    startTime: number;
    endTime: number;
  }>;
}

export class TranscriptionService {
  private openai: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async transcribeAudio(audioBlob: Blob, matterId?: string): Promise<TranscriptionResult> {
    try {
      // Audio fájl konvertálása base64 formátumra
      const buffer = await audioBlob.arrayBuffer();
      const base64Audio = Buffer.from(buffer).toString('base64');

      // OpenAI API hívás a hangátiratért
      const response = await this.openai.createTranscription({
        file: base64Audio,
        model: 'whisper-1',
        language: 'hu',
        response_format: 'verbose_json',
      });

      const transcription = response.data;

      // Ha van matterId, mentjük az átiratot
      if (matterId) {
        await this.saveTranscription(transcription.text, matterId);
      }

      return {
        text: transcription.text,
        confidence: transcription.confidence || 0,
      };
    } catch (error) {
      console.error('Hangátirat hiba:', error);
      throw new Error('Hiba történt a hangátirat feldolgozása során');
    }
  }

  async transcribeWithSpeakerDetection(
    audioBlob: Blob,
    matterId?: string
  ): Promise<TranscriptionResult> {
    try {
      // Audio fájl konvertálása base64 formátumra
      const buffer = await audioBlob.arrayBuffer();
      const base64Audio = Buffer.from(buffer).toString('base64');

      // OpenAI API hívás a hangátiratért beszélő azonosítással
      const response = await this.openai.createTranscription({
        file: base64Audio,
        model: 'whisper-1',
        language: 'hu',
        response_format: 'verbose_json',
        speaker_detection: true,
      });

      const transcription = response.data;

      // Ha van matterId, mentjük az átiratot
      if (matterId) {
        await this.saveTranscription(transcription.text, matterId);
      }

      return {
        text: transcription.text,
        confidence: transcription.confidence || 0,
        speakerSegments: transcription.speaker_segments?.map(segment => ({
          speaker: segment.speaker,
          text: segment.text,
          startTime: segment.start_time,
          endTime: segment.end_time,
        })),
      };
    } catch (error) {
      console.error('Hangátirat hiba:', error);
      throw new Error('Hiba történt a hangátirat feldolgozása során');
    }
  }

  private async saveTranscription(text: string, matterId: string) {
    try {
      // Átirat mentése jegyzetként
      await prisma.note.create({
        data: {
          matterId,
          content: text,
          type: 'VOICE_NOTE',
          metadata: {
            transcription: true,
            timestamp: new Date().toISOString(),
          },
        },
      });

      // Kulcsszavak kinyerése és mentése
      const keywords = await this.extractKeywords(text);
      await this.saveKeywords(keywords, matterId);
    } catch (error) {
      console.error('Átirat mentési hiba:', error);
      throw new Error('Hiba történt az átirat mentése során');
    }
  }

  private async extractKeywords(text: string): Promise<string[]> {
    try {
      // OpenAI API hívás a kulcsszavak kinyeréséhez
      const response = await this.openai.createCompletion({
        model: 'gpt-3.5-turbo',
        prompt: `Keresd meg a legfontosabb kulcsszavakat a következő szövegből:\n\n${text}`,
        max_tokens: 100,
        temperature: 0.3,
      });

      const keywords = response.data.choices[0].text
        ?.split(',')
        .map(keyword => keyword.trim())
        .filter(Boolean) || [];

      return keywords;
    } catch (error) {
      console.error('Kulcsszavak kinyerési hiba:', error);
      return [];
    }
  }

  private async saveKeywords(keywords: string[], matterId: string) {
    try {
      // Kulcsszavak mentése
      await prisma.matter.update({
        where: { id: matterId },
        data: {
          keywords: {
            push: keywords,
          },
        },
      });
    } catch (error) {
      console.error('Kulcsszavak mentési hiba:', error);
    }
  }
} 