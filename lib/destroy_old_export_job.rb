DestroyOldExportJob = Struct.new(:export_id)
class DestroyOldExportJob
  def perform
    Export.memory_safe_destroy(export_id)
  end
end
