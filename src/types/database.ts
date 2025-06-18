export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          user_id: string | null
          address: string
          city: string | null
          state: string | null
          zip_code: string | null
          bedrooms: number | null
          bathrooms: number | null
          square_feet: number | null
          year_built: number | null
          property_type: string | null
          lot_size: string | null
          condition: string | null
          description: string | null
          photos: string[] | null
          status: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          address: string
          city?: string | null
          state?: string | null
          zip_code?: string | null
          bedrooms?: number | null
          bathrooms?: number | null
          square_feet?: number | null
          year_built?: number | null
          property_type?: string | null
          lot_size?: string | null
          condition?: string | null
          description?: string | null
          photos?: string[] | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          address?: string
          city?: string | null
          state?: string | null
          zip_code?: string | null
          bedrooms?: number | null
          bathrooms?: number | null
          square_feet?: number | null
          year_built?: number | null
          property_type?: string | null
          lot_size?: string | null
          condition?: string | null
          description?: string | null
          photos?: string[] | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      quotes: {
        Row: {
          id: string
          property_id: string | null
          user_id: string | null
          amount: number
          status: string | null
          expires_at: string | null
          timeline: string | null
          motivation: string | null
          calculation_details: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          property_id?: string | null
          user_id?: string | null
          amount: number
          status?: string | null
          expires_at?: string | null
          timeline?: string | null
          motivation?: string | null
          calculation_details?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          property_id?: string | null
          user_id?: string | null
          amount?: number
          status?: string | null
          expires_at?: string | null
          timeline?: string | null
          motivation?: string | null
          calculation_details?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          user_type: string | null
          company_name: string | null
          license_number: string | null
          preferences: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          user_type?: string | null
          company_name?: string | null
          license_number?: string | null
          preferences?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          user_type?: string | null
          company_name?: string | null
          license_number?: string | null
          preferences?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      property_photos: {
        Row: {
          id: string
          property_id: string | null
          url: string
          caption: string | null
          is_primary: boolean | null
          upload_order: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          property_id?: string | null
          url: string
          caption?: string | null
          is_primary?: boolean | null
          upload_order?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          property_id?: string | null
          url?: string
          caption?: string | null
          is_primary?: boolean | null
          upload_order?: number | null
          created_at?: string | null
        }
      }
      property_inspections: {
        Row: {
          id: string
          property_id: string | null
          inspector_id: string | null
          scheduled_date: string | null
          completed_date: string | null
          status: string | null
          findings: Json | null
          estimated_repair_cost: number | null
          notes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          property_id?: string | null
          inspector_id?: string | null
          scheduled_date?: string | null
          completed_date?: string | null
          status?: string | null
          findings?: Json | null
          estimated_repair_cost?: number | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          property_id?: string | null
          inspector_id?: string | null
          scheduled_date?: string | null
          completed_date?: string | null
          status?: string | null
          findings?: Json | null
          estimated_repair_cost?: number | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      contracts: {
        Row: {
          id: string
          quote_id: string | null
          contract_number: string | null
          purchase_price: number
          earnest_money: number | null
          closing_date: string | null
          contingencies: Json | null
          status: string | null
          signed_by_seller_at: string | null
          signed_by_buyer_at: string | null
          contract_pdf_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          quote_id?: string | null
          contract_number?: string | null
          purchase_price: number
          earnest_money?: number | null
          closing_date?: string | null
          contingencies?: Json | null
          status?: string | null
          signed_by_seller_at?: string | null
          signed_by_buyer_at?: string | null
          contract_pdf_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          quote_id?: string | null
          contract_number?: string | null
          purchase_price?: number
          earnest_money?: number | null
          closing_date?: string | null
          contingencies?: Json | null
          status?: string | null
          signed_by_seller_at?: string | null
          signed_by_buyer_at?: string | null
          contract_pdf_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      documents: {
        Row: {
          id: string
          property_id: string | null
          contract_id: string | null
          uploaded_by: string | null
          document_type: string
          file_name: string
          file_url: string
          file_size: number | null
          mime_type: string | null
          description: string | null
          is_required: boolean | null
          verified_at: string | null
          verified_by: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          property_id?: string | null
          contract_id?: string | null
          uploaded_by?: string | null
          document_type: string
          file_name: string
          file_url: string
          file_size?: number | null
          mime_type?: string | null
          description?: string | null
          is_required?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          property_id?: string | null
          contract_id?: string | null
          uploaded_by?: string | null
          document_type?: string
          file_name?: string
          file_url?: string
          file_size?: number | null
          mime_type?: string | null
          description?: string | null
          is_required?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
          created_at?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          property_id: string | null
          sender_id: string | null
          recipient_id: string | null
          subject: string | null
          message: string
          message_type: string | null
          is_read: boolean | null
          read_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          property_id?: string | null
          sender_id?: string | null
          recipient_id?: string | null
          subject?: string | null
          message: string
          message_type?: string | null
          is_read?: boolean | null
          read_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          property_id?: string | null
          sender_id?: string | null
          recipient_id?: string | null
          subject?: string | null
          message?: string
          message_type?: string | null
          is_read?: boolean | null
          read_at?: string | null
          created_at?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string | null
          title: string
          message: string
          notification_type: string | null
          related_property_id: string | null
          related_quote_id: string | null
          is_read: boolean | null
          read_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          message: string
          notification_type?: string | null
          related_property_id?: string | null
          related_quote_id?: string | null
          is_read?: boolean | null
          read_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          message?: string
          notification_type?: string | null
          related_property_id?: string | null
          related_quote_id?: string | null
          is_read?: boolean | null
          read_at?: string | null
          created_at?: string | null
        }
      }
      property_valuations: {
        Row: {
          id: string
          property_id: string | null
          valuation_type: string | null
          estimated_value: number | null
          confidence_score: number | null
          data_sources: Json | null
          comparable_properties: Json | null
          market_trends: Json | null
          valuation_date: string | null
          expires_at: string | null
          created_by: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          property_id?: string | null
          valuation_type?: string | null
          estimated_value?: number | null
          confidence_score?: number | null
          data_sources?: Json | null
          comparable_properties?: Json | null
          market_trends?: Json | null
          valuation_date?: string | null
          expires_at?: string | null
          created_by?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          property_id?: string | null
          valuation_type?: string | null
          estimated_value?: number | null
          confidence_score?: number | null
          data_sources?: Json | null
          comparable_properties?: Json | null
          market_trends?: Json | null
          valuation_date?: string | null
          expires_at?: string | null
          created_by?: string | null
          created_at?: string | null
        }
      }
      property_history: {
        Row: {
          id: string
          property_id: string | null
          changed_by: string | null
          change_type: string
          old_values: Json | null
          new_values: Json | null
          notes: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          property_id?: string | null
          changed_by?: string | null
          change_type: string
          old_values?: Json | null
          new_values?: Json | null
          notes?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          property_id?: string | null
          changed_by?: string | null
          change_type?: string
          old_values?: Json | null
          new_values?: Json | null
          notes?: string | null
          created_at?: string | null
        }
      }
      closing_details: {
        Row: {
          id: string
          contract_id: string | null
          title_company: string | null
          title_company_contact: Json | null
          closing_attorney: string | null
          attorney_contact: Json | null
          scheduled_closing_date: string | null
          actual_closing_date: string | null
          final_walkthrough_date: string | null
          keys_transferred_at: string | null
          wire_transfer_details: Json | null
          closing_costs: Json | null
          status: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          contract_id?: string | null
          title_company?: string | null
          title_company_contact?: Json | null
          closing_attorney?: string | null
          attorney_contact?: Json | null
          scheduled_closing_date?: string | null
          actual_closing_date?: string | null
          final_walkthrough_date?: string | null
          keys_transferred_at?: string | null
          wire_transfer_details?: Json | null
          closing_costs?: Json | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          contract_id?: string | null
          title_company?: string | null
          title_company_contact?: Json | null
          closing_attorney?: string | null
          attorney_contact?: Json | null
          scheduled_closing_date?: string | null
          actual_closing_date?: string | null
          final_walkthrough_date?: string | null
          keys_transferred_at?: string | null
          wire_transfer_details?: Json | null
          closing_costs?: Json | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      market_data: {
        Row: {
          id: string
          zip_code: string
          city: string | null
          state: string | null
          median_home_price: number | null
          price_per_sqft: number | null
          days_on_market: number | null
          inventory_level: string | null
          market_trend: string | null
          data_date: string | null
          source: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          zip_code: string
          city?: string | null
          state?: string | null
          median_home_price?: number | null
          price_per_sqft?: number | null
          days_on_market?: number | null
          inventory_level?: string | null
          market_trend?: string | null
          data_date?: string | null
          source?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          zip_code?: string
          city?: string | null
          state?: string | null
          median_home_price?: number | null
          price_per_sqft?: number | null
          days_on_market?: number | null
          inventory_level?: string | null
          market_trend?: string | null
          data_date?: string | null
          source?: string | null
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_property_offer: {
        Args: {
          p_square_feet: number
          p_bedrooms: number
          p_bathrooms: number
          p_year_built: number
          p_condition: string
          p_zip_code: string
        }
        Returns: number
      }
      create_property_quote: {
        Args: {
          p_property_id: string
          p_user_id: string
          p_timeline: string
          p_motivation: string
        }
        Returns: string
      }
      get_user_dashboard_stats: {
        Args: {
          p_user_id: string
        }
        Returns: Json
      }
      mark_notifications_read: {
        Args: {
          p_user_id: string
          p_notification_ids: string[]
        }
        Returns: number
      }
      get_property_timeline: {
        Args: {
          p_property_id: string
          p_user_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for common use cases
export type Property = Database['public']['Tables']['properties']['Row']
export type PropertyInsert = Database['public']['Tables']['properties']['Insert']
export type PropertyUpdate = Database['public']['Tables']['properties']['Update']

export type Quote = Database['public']['Tables']['quotes']['Row']
export type QuoteInsert = Database['public']['Tables']['quotes']['Insert']
export type QuoteUpdate = Database['public']['Tables']['quotes']['Update']

export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert']
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']

export type PropertyPhoto = Database['public']['Tables']['property_photos']['Row']
export type PropertyInspection = Database['public']['Tables']['property_inspections']['Row']
export type Contract = Database['public']['Tables']['contracts']['Row']
export type Document = Database['public']['Tables']['documents']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type PropertyValuation = Database['public']['Tables']['property_valuations']['Row']
export type PropertyHistory = Database['public']['Tables']['property_history']['Row']
export type ClosingDetails = Database['public']['Tables']['closing_details']['Row']
export type MarketData = Database['public']['Tables']['market_data']['Row']

// Enums for type safety
export type PropertyStatus = 'active' | 'under_contract' | 'sold' | 'withdrawn' | 'expired'
export type QuoteStatus = 'pending' | 'reviewed' | 'offer_made' | 'accepted' | 'declined' | 'expired' | 'closed'
export type ContractStatus = 'draft' | 'sent' | 'signed' | 'executed' | 'cancelled'
export type InspectionStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
export type PropertyCondition = 'excellent' | 'good' | 'fair' | 'needs-work'
export type UserType = 'seller' | 'buyer' | 'agent' | 'inspector' | 'admin'
export type DocumentType = 'deed' | 'title' | 'survey' | 'inspection_report' | 'appraisal' | 'insurance' | 'tax_records' | 'hoa_docs' | 'utility_bills' | 'repair_estimates' | 'contract' | 'addendum' | 'disclosure' | 'other'
export type MessageType = 'general' | 'offer_update' | 'inspection_request' | 'document_request' | 'closing_update' | 'system_notification'
export type NotificationType = 'quote_ready' | 'inspection_scheduled' | 'document_uploaded' | 'contract_update' | 'closing_reminder' | 'payment_received' | 'general'
export type ValuationType = 'automated' | 'comparative_market_analysis' | 'professional_appraisal'
export type InventoryLevel = 'low' | 'moderate' | 'high'
export type MarketTrend = 'rising' | 'stable' | 'declining'
export type ClosingStatus = 'scheduled' | 'in_progress' | 'completed' | 'delayed'
export type Timeline = 'asap' | '30_days' | '60_days' | '90_days' | 'flexible'

// Dashboard stats type
export interface DashboardStats {
  total_properties: number
  total_quotes: number
  active_quotes: number
  completed_sales: number
  total_offers: number
  unread_notifications: number
}

// Property with related data
export interface PropertyWithDetails extends Property {
  quotes?: Quote[]
  photos?: PropertyPhoto[]
  inspections?: PropertyInspection[]
  valuations?: PropertyValuation[]
  documents?: Document[]
  history?: PropertyHistory[]
}

// Quote with related data
export interface QuoteWithDetails extends Quote {
  property?: Property
  contract?: Contract
}

// Timeline event type
export interface TimelineEvent {
  source: string
  event_type: string
  description: string
  created_at: string
  metadata: Json
} 