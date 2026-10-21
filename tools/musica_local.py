import numpy as np, soundfile as sf, torch
# Genera local-comun/bgm/seed.wav (28 s); luego: ffmpeg -i seed.wav -i seed.wav -filter_complex "[0][1]acrossfade=d=3:c1=tri:c2=tri" track.wav
from transformers import AutoProcessor, MusicgenForConditionalGeneration
p = AutoProcessor.from_pretrained("facebook/musicgen-small")
m = MusicgenForConditionalGeneration.from_pretrained("facebook/musicgen-small")
torch.manual_seed(7)
prompt = "energetic electronic gaming hype track, punchy drums, deep 808 bass, bright synth arpeggios, esports arena energy, 128 bpm, no vocals"
x = p(text=[prompt], padding=True, return_tensors="pt")
a = m.generate(**x, max_new_tokens=int(28 * 50), do_sample=True, guidance_scale=3.0)
sr = m.config.audio_encoder.sampling_rate
w = a[0, 0].cpu().numpy(); w = w / (np.abs(w).max() + 1e-9) * 0.9
sf.write("seed.wav", w, sr); print("ok", len(w) / sr)
