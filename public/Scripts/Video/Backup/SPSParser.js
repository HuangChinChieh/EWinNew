/*
1. T-REC-H.264-200305-S!!PDF-E.pdf chapter 9.1 Parsing process for Exp-Golomb codes 
2. http://en.wikipedia.org/wiki/Exponential-Golomb_coding
3. http://www.cnblogs.com/jckimi/archive/2013/01/03/2842917.html

source url: https://github.com/alb423/sps_pps_parser
*/

var vBitCount = 0;
var vBitLength = 0;

function get_bit(base, offset) {
    var vCurBytes = (vBitCount + offset) >> 3;
    offset = (vBitCount + offset) & 0x00000007;

    if (base.length > vCurBytes)
        return (((base[(vCurBytes)])) >> (0x7 - (offset & 0x7))) & 0x1;
    else
        return 0;
}

function read_bits(pBuf, vReadBits) {
    var vCurBytes = vBitCount / 8;
    var vCurBits = vBitCount % 8;
    var vOffset = 0;
    var vTmp = 0, vTmp2 = 0;

    //document.write("<br/> u(" + vReadBits + ")");   
    if (vReadBits == 1) {
        vTmp = get_bit(pBuf, vOffset);
        //document.write(" " + vTmp);
    }
    else {
        for (i = 0; i < vReadBits; i++) {
            vTmp2 = get_bit(pBuf, i);
            //document.write(" " + vTmp2);
            vTmp = (vTmp << 1) + vTmp2;
        }
    }

    vBitCount += vReadBits;
    return vTmp;
}

// Reference
function ue(base, offset) {
    var zeros = 0, vTmp = 0, vReturn = 0;
    var vIdx = offset;

    //document.write("<br/> ue(v)");
    do {
        vTmp = get_bit(base, vIdx++);
        //document.write(" " + vTmp);
        if (vTmp == 0)
            zeros++;
    }
    while (0 == vTmp);

    if (zeros == 0) {
        vBitCount += 1;
        return 0;
    }

    // insert first 1 bit
    vReturn = 1 << zeros;

    for (i = zeros - 1; i >= 0; i--, vIdx++) {
        vTmp = get_bit(base, vIdx);
        //document.write(" " + vTmp);
        vReturn |= vTmp << i;
    }

    vBitCount += zeros * 2 + 1;

    return (vReturn - 1);
}

function se(base, offset) {
    var zeros = 0, vTmp = 0, vReturn = 0;
    var vIdx = offset;

    //document.write("<br/> se(v)");
    do {
        vTmp = get_bit(base, vIdx++);
        //document.write(" " + vTmp);
        if (vTmp == 0)
            zeros++;
    }
    while (0 == vTmp);

    if (zeros == 0) {
        vBitCount += 1;
        return 0;
    }

    // insert first 1 bit
    vReturn = 1 << zeros;

    for (i = zeros - 1; i >= 0; i--, vIdx++) {
        vTmp = get_bit(base, vIdx);
        //document.write(" " + vTmp);
        vReturn |= vTmp << i;
    }
    vBitCount += zeros * 2 + 1;

    // (–1)k+1 Ceil(k÷2)
    if (vReturn & 0x1 == 1)
        vReturn = -1 * Math.ceil(vReturn / 2);
    else
        vReturn = Math.ceil(vReturn / 2);

    return vReturn;
}

function byte_aligned() {
    if ((vBitCount & 0x00000007) == 0)
        return 1;
    else
        return 0;
}

function hrd_parameters(pSPSBytes) {
    var cpb_cnt_minus1 = ue(pSPSBytes, 0);
    var r = {};

    r.cpb_cnt_minus1 = cpb_cnt_minus1;
    r.bit_rate_scale = read_bits(pSPSBytes, 4);
    r.cpb_size_scale = read_bits(pSPSBytes, 4);
    r.cpb_minus1 = [];

    for (SchedSelIdx = 0; SchedSelIdx <= cpb_cnt_minus1; SchedSelIdx++) {
        r.cpb_minus1[SchedSelIdx] = {};

        r.cpb_minus1[SchedSelIdx].bit_rate_value_minus1 = ue(pSPSBytes, 0);
        r.cpb_minus1[SchedSelIdx].cpb_size_value_minus1 = ue(pSPSBytes, 0);
        r.cpb_minus1[SchedSelIdx].cbr_flag = read_bits(pSPSBytes, 1);
    }
    r.initial_cpb_removal_delay_length_minus1 = read_bits(pSPSBytes, 5);
    r.cpb_removal_delay_length_minus1 = read_bits(pSPSBytes, 5);
    r.dpb_output_delay_length_minus1 = read_bits(pSPSBytes, 5);
    r.time_offset_length = read_bits(pSPSBytes, 5);

    return r;
}

function vui_parameters(pSPSBytes) {
    var aspect_ratio_info_present_flag, aspect_ratio_idc;
    var overscan_info_present_flag, video_signal_type_present_flag, colour_description_present_flag;
    var chroma_loc_info_present_flag, timing_info_present_flag;
    var nal_hrd_parameters_present_flag, vcl_hrd_parameters_present_flag, bitstream_restriction_flag;
    var r = {};


    r.aspect_ratio_info_present_flag = read_bits(pSPSBytes, 1);
    if (r.aspect_ratio_info_present_flag) {
        r.aspect_ratio_idc = read_bits(pSPSBytes, 8);
        if (r.aspect_ratio_idc == 1) // Extended_SAR ??
        {
            r.sar_width = read_bits(pSPSBytes, 16);
            r.sar_height = read_bits(pSPSBytes, 16);
        }
    }

    r.overscan_info_present_flag = read_bits(pSPSBytes, 1);
    if (r.overscan_info_present_flag) {
        r.overscan_appropriate_flag = read_bits(pSPSBytes, 1);
    }

    r.video_signal_type_present_flag = read_bits(pSPSBytes, 1);
    if (video_signal_type_present_flag) {
        r.video_format = read_bits(pSPSBytes, 3);
        r.video_full_range_flag = read_bits(pSPSBytes, 1);
        r.colour_description_present_flag = read_bits(pSPSBytes, 1);
        if (r.colour_description_present_flag) {
            r.colour_primaries = read_bits(pSPSBytes, 8);
            r.transfer_characteristics = read_bits(pSPSBytes, 8);
            r.matrix_coefficients = read_bits(pSPSBytes, 8);
        }
    }

    r.chroma_loc_info_present_flag = read_bits(pSPSBytes, 1);
    if (r.chroma_loc_info_present_flag) {
        r.chroma_sample_loc_type_top_field = ue(pSPSBytes, 0);
        r.chroma_sample_loc_type_bottom_field = ue(pSPSBytes, 0);
    }

    r.timing_info_present_flag = read_bits(pSPSBytes, 1);
    if (r.timing_info_present_flag) {
        r.num_units_in_tick = read_bits(pSPSBytes, 32);
        r.time_scale = read_bits(pSPSBytes, 32);
        r.fixed_frame_rate_flag = read_bits(pSPSBytes, 1);
    }

    r.nal_hrd_parameters_present_flag = read_bits(pSPSBytes, 1);
    if (r.nal_hrd_parameters_present_flag) {
        r.nal_hrd_parameters = hrd_parameters(pSPSBytes);
    }

    r.vcl_hrd_parameters_present_flag = read_bits(pSPSBytes, 1);
    if (r.vcl_hrd_parameters_present_flag) {
        r.vcl_hrd_parameters = hrd_parameters(pSPSBytes);
    }

    if (r.nal_hrd_parameters_present_flag || r.vcl_hrd_parameters_present_flag) {
        r.low_delay_hrd_flag = read_bits(pSPSBytes, 1);
    }

    r.pic_struct_present_flag = read_bits(pSPSBytes, 1);
    r.bitstream_restriction_flag = read_bits(pSPSBytes, 1);
    if (r.bitstream_restriction_flag) {
        r.motion_vectors_over_pic_boundaries_flag = read_bits(pSPSBytes, 1);
        r.max_bytes_per_pic_denom = ue(pSPSBytes, 0);
        r.max_bits_per_mb_denom = ue(pSPSBytes, 0);
        r.log2_max_mv_length_horizontal = ue(pSPSBytes, 0);
        r.log2_max_mv_length_vertical = ue(pSPSBytes, 0);
        r.num_reorder_frames = ue(pSPSBytes, 0);
        r.max_dec_frame_buffering = ue(pSPSBytes, 0);
    }

    return r;
}

function rbsp_trailing_bits(pInput) {
    // Chapter 7.3.2.11 
    var rbsp_stop_one_bit = 0;

    if (vBitCount + 1 == vBitLength) {
        return 1;
    }
    rbsp_stop_one_bit = read_bits(pInput, 1); // equal to 1
    while (!byte_aligned()) {
        rbsp_alignment_zero_bit = read_bits(pInput, 1);
    }

    return 1;
}



function seq_parameter_set_rbsp(pSPSBytes) {
    // Chapter 7.3.2.1
    // SPS parser
    var index, profile_idc = 0, pic_order_cnt_type = 0;
    var pic_width_in_mbs_minus1 = 0, pic_height_in_map_units_minus1 = 0;
    var frame_mbs_only_flag = 0, frame_cropping_flag = 0;
    var r = {};

    vBitCount = 0;
    vBitLength = pSPSBytes.length * 8;

    // forbidden_zero_bit, nal_ref_idc, nal_unit_type
    r.forbidden_zero_bit = read_bits(pSPSBytes, 1);
    r.nal_ref_idc = read_bits(pSPSBytes, 2);
    r.nal_unit_type = read_bits(pSPSBytes, 5);

    // profile_idc
    r.profile_idc = read_bits(pSPSBytes, 8);

    // constrained_set0_flag, ... , constrained_set4_flag, reserved_zero_3bits
    r.constrained_set0_flag = read_bits(pSPSBytes, 1);
    r.constrained_set1_flag = read_bits(pSPSBytes, 1);
    r.constrained_set2_flag = read_bits(pSPSBytes, 1);
    r.constrained_set3_flag = read_bits(pSPSBytes, 1);
    r.constrained_set4_flag = read_bits(pSPSBytes, 1);
    r.reserved_zero_3bits = read_bits(pSPSBytes, 3);

    // level_idc
    r.level_idc = read_bits(pSPSBytes, 8);

    if ((r.profile_idc == 100) || (r.profile_idc == 110) || (r.profile_idc == 122) ||
       (r.profile_idc == 244) || (r.profile_idc == 44) || (r.profile_idc == 83) ||
       (r.profile_idc == 86) || (r.profile_idc == 118)) {
        r.seq_parameter_set_id = 0;
    }
    else {
        r.seq_parameter_set_id = ue(pSPSBytes, 0);
    }

    r.log2_max_frame_num_minus4 = ue(pSPSBytes, 0);
    r.pic_order_cnt_type = ue(pSPSBytes, 0);

    if (r.pic_order_cnt_type == 0) {
        r.log2_max_pic_order_cnt_lsb_minus4 = ue(pSPSBytes, 0);
    }
    else if (r.pic_order_cnt_type == 1) {
        var num_ref_frames_in_pic_order_cnt_cycle = 0;
        r.delta_pic_order_always_zero_flag = read_bits(pSPSBytes, 1);
        r.offset_for_non_ref_pic = se(pSPSBytes, 0);
        r.offset_for_top_to_bottom_field = se(pSPSBytes, 0);

        num_ref_frames_in_pic_order_cnt_cycle = ue(pSPSBytes, 0);
        r.num_ref_frames_in_pic_order_cnt_cycle = [];

        for (i = 0; i < num_ref_frames_in_pic_order_cnt_cycle; i++) {
            r.num_ref_frames_in_pic_order_cnt_cycle[i] = se(pSPSBytes, 0);
        }
    }

    r.num_ref_frames = ue(pSPSBytes, 0);
    r.gaps_in_frame_num_value_allowed_flag = read_bits(pSPSBytes, 1);

    r.pic_width_in_mbs_minus1 = ue(pSPSBytes, 0);
    r.pic_height_in_map_units_minus1 = ue(pSPSBytes, 0);

    //document.write(" (resolution=" + ((pic_width_in_mbs_minus1 + 1) * 16) + "x" + ((pic_height_in_map_units_minus1 + 1) * 16) + ")");

    r.frame_mbs_only_flag = read_bits(pSPSBytes, 1);

    if (r.frame_mbs_only_flag == 0) {
        r.mb_adaptive_frame_field_flag = read_bits(pSPSBytes, 1);
    }
    r.direct_8x8_interence_flag = read_bits(pSPSBytes, 1);
    r.frame_cropping_flag = read_bits(pSPSBytes, 1);
    if (r.frame_cropping_flag == 1) {
        r.frame_cropping_rect_left_offset = ue(pSPSBytes, 0);
        r.frame_cropping_rect_right_offset = ue(pSPSBytes, 0);
        r.frame_cropping_rect_top_offset = ue(pSPSBytes, 0);
        r.frame_cropping_rect_bottom_offset = ue(pSPSBytes, 0);
    }

    r.vui_parameters_present_flag = read_bits(pSPSBytes, 1);

    /*
    if (r.vui_parameters_present_flag) {
        r.vui_parameters = vui_parameters(pSPSBytes);
    }

    rbsp_trailing_bits(pSPSBytes);
    */

    return r;
}



function pic_parameter_set_rbsp(pPPSBytes) {
    // PPS parser --> 
    // PPS decode : 0x68 0xce 0x30 0xa4 0x80 
    // Reference http://ffmpeg.org/doxygen/0.6/h264__ps_8c-source.html#l00427
    var num_slice_groups_minus1 = 0, slice_group_map_type = 0;
    var pic_size_in_map_units_minus1 = 0, chroma_qp_index_offset = 0;
    var r = {};

    vBitCount = 0;
    vBitLength = pPPSBytes.length * 8;

    r.forbidden_zero_bit = read_bits(pPPSBytes, 1);
    r.nal_ref_idc = read_bits(pPPSBytes, 2);
    r.nal_unit_type = read_bits(pPPSBytes, 5);

    r.pic_parameter_set_id = ue(pPPSBytes, 0);
    r.seq_parameter_set_id = ue(pPPSBytes, 0);
    r.entropy_coding_mode_flag = read_bits(pPPSBytes, 1);
    r.pic_order_present_flag = read_bits(pPPSBytes, 1);
    r.num_slice_groups_minus1 = ue(pPPSBytes, 0);
    if (r.num_slice_groups_minus1 > 0) {
        r.slice_group_map_type = ue(pPPSBytes, 0);
        if (r.slice_group_map_type == 0) {
            r.run_length_minus1 = [];
            for (iGroup = 0; iGroup <= num_slice_groups_minus1; iGroup++) {
                r.run_length_minus1[iGroup] = ue(pPPSBytes, 0);
            }
        }
        else if (r.slice_group_map_type == 2) {
            r.slice_groups = [];
            for (iGroup = 0; iGroup <= num_slice_groups_minus1; iGroup++) {
                r.slice_groups[iGroup] = {};

                r.slice_groups[iGroup].top_left = ue(pPPSBytes, 0);
                r.slice_groups[iGroup].bottom_right = ue(pPPSBytes, 0);
            }
        }
        else if ((r.slice_group_map_type == 3) || (r.slice_group_map_type == 4) || (r.slice_group_map_type == 5)) {
            r.slice_group_change_direction_flag = read_bits(pPPSBytes, 1);
            r.slice_group_change_rate_minus1 = ue(pPPSBytes, 0);
        }
        else if (r.slice_group_map_type == 6) {
            r.pic_size_in_map_units_minus1 = ue(pPPSBytes, 0);
            r.slice_group_id = [];
            for (iGroup = 0; iGroup <= pic_size_in_map_units_minus1; iGroup++) {
                r.slice_group_id[iGroup] = ue(pPPSBytes, 0);
            }
        }
    }

    r.num_ref_idx_l0_active_minus1 = ue(pPPSBytes, 0);
    r.num_ref_idx_l1_active_minus1 = ue(pPPSBytes, 0);
    r.weighted_pref_flag = read_bits(pPPSBytes, 1);
    r.weighted_bipred_idc = read_bits(pPPSBytes, 2);

    r.pic_init_qp_minus26 = se(pPPSBytes, 0);
    r.pic_init_qs_minus26 = se(pPPSBytes, 0);

    r.chroma_qp_index_offset = se(pPPSBytes, 0);
    r.chroma_qp_index_offset = chroma_qp_index_offset;

    r.deblocking_filter_control_present_flag = read_bits(pPPSBytes, 1);
    r.constrained_intra_pred_flag = read_bits(pPPSBytes, 1);
    r.redundant_pic_cnt_present_flag = read_bits(pPPSBytes, 1);

    rbsp_trailing_bits(pPPSBytes);
    /*
    if(0)//vBitCount < vBitLength)
    {
       document.write("<br /> transform_8x8_mode_flag=" + read_bits(pPPSBytes, 1));
       document.write("<br /> pic_scaling_matrix_present_flag=" + read_bits(pPPSBytes, 1));
       //document.write("<br /> second_chroma_qp_index_offset" + ue(pPPSBytes, 0));
    }
    else
    {
       document.write("<br /> transform_8x8_mode_flag=0");
       document.write("<br /> pic_scaling_matrix_present_flag=0");
       document.write("<br /> second_chroma_qp_index_offset=" + chroma_qp_index_offset);
    }
    */
    // rbsp_trainlig_bits()  rbsp_stop_one_bit + rbsp_alignment_zero_bit

    return r;
}
