import mongoose from 'mongoose';

// Define the default keys
const defaultKeys = {
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  created_by: { type: mongoose.Types.ObjectId, required: true },
  updated_by: { type: mongoose.Types.ObjectId, required: false},
  // tenant_id: { type: String, required: false },
  is_deleted: { type: Boolean, default: false }
};

// Create the plugin
const addDefaultKeysPlugin = (schema:any) => {
    schema.add(defaultKeys);
  };

  // Apply the plugin to all schemas
mongoose.plugin(addDefaultKeysPlugin);

export default mongoose;