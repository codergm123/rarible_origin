module CollectionsHelper
  def cover_url(collection)
    return '/assets/dummy-image.jpg' if unauthorized_to_show_attachment(collection)
    attachment = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'].include?(collection.attachment.content_type) ? collection.attachment_with_variant(:thumb) : collection.cover
    attachment.present? ? url_for(attachment) : '/assets/banner-1.png'
    # pinata_url(collection)
  end

  def attachment_tag(collection)
    attachment = collection.attachment
    return image_tag '/assets/dummy-image.jpg', class: "img-responsive" if unauthorized_to_show_attachment(collection)

    if ['audio/mp3', 'audio/webm', 'audio/mpeg'].include?(attachment.content_type)
      audio_tag url_for(attachment), size: "550x400", controls: true
    elsif ['video/mp4', 'video/webm'].include?(attachment.content_type)
      video_tag url_for(attachment), class: "video-responsive", controls: true
    else
      # image_tag pinata_url(collection), class: "img-responsive"
      image_tag url_for(attachment), class: "img-responsive"
    end
  end

  def cover_tag(collection)
    attachment = collection.attachment
    if ['audio/mp3', 'audio/webm', 'audio/mpeg'].include?(attachment.content_type)
      image_tag cover_url(collection), class: "img-responsive"
    end
  end

  def unauthorized_to_show_attachment(collection)
    # collection.unlock_on_purchase? && (!current_user.present? || (current_user && current_user != collection.owner))
    return false
  end

  def pinata_url(collection)
    collection.image_hash.present? ? "https://gateway.pinata.cloud/ipfs/#{collection.image_hash}" : '/assets/dummy-image.jpg'
  end
end
