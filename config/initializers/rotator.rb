module Paperclip
  class Rotator < Thumbnail
    def transformation_command
      if rotate_command
        super + rotate_command
      else
        super
      end
    end
    
    def rotate_command
      target = @attachment.instance
      if target.rotating?
        " -rotate #{target.rotation}"
      end
    end
  end
end
