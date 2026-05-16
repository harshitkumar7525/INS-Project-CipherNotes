import mongoose, { Schema, models, model } from "mongoose";

const NoteSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    content: { type: String, required: true }, // DES ciphertext
  },
  { timestamps: true }
);

export type INote = mongoose.InferSchemaType<typeof NoteSchema> & { _id: mongoose.Types.ObjectId };
export const Note = models.Note || model("Note", NoteSchema);
