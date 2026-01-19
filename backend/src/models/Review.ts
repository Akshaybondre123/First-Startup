import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  restaurantId: mongoose.Types.ObjectId;
  userName: string;
  userEmail?: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    userName: { type: String, required: true },
    userEmail: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 1000 },
  },
  {
    timestamps: true,
  }
);

// Create indexes for common queries
ReviewSchema.index({ restaurantId: 1, createdAt: -1 });
ReviewSchema.index({ rating: -1 });

const Review = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;

