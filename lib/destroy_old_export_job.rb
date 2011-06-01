class DestroyOldExportJob < Struct.new(:export_id)
  def perform
    Export.memory_safe_destroy(export_id)
  end
end
